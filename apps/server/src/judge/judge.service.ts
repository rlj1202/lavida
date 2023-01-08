import { Duplex, PassThrough, Readable, Stream, Writable } from 'stream';
import { Injectable, Logger } from '@nestjs/common';
import path = require('path');
import { readdir, readFile } from 'fs/promises';
import Docker = require('dockerode');

import { SubmissionsService } from 'src/submissions/submissions.service';
import { ProblemsService } from 'src/problems/problems.service';
import { SubmissionStatus } from 'src/submissions/entities/submission.entity';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { UserProblemsService } from 'src/userProblems/user-problems.service';

export type JudgeStatus =
  | 'ACCEPTED'
  | 'JUDGING'
  | 'WRONG_ANSWER'
  | 'COMPILE_ERROR'
  | 'RUNTIME_ERROR'
  | 'TIME_LIMIT_EXCEEDED'
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'SERVER_ERROR';

export interface JudgeResult {
  status: JudgeStatus;
  /** In milli seconds */
  time?: number;
  /** In bytes */
  memory?: number;
  msg?: string;
}

class CompileError extends Error {
  constructor(public exitCode: number, msg?: string) {
    super(msg);
    this.name = 'CompileError';
  }
}

class RuntimeError extends Error {
  constructor(public exitCode: number, msg?: string) {
    super(msg);
    this.name = 'RuntimeError';
  }
}

class TimeLimitExceededError extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = 'TimeLimitExceededError';
  }
}

class MemoryLimitExceededError extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = 'MemoryLimitExceededError';
  }
}

async function readAll(stream: Stream): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];

    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (error) => reject(error));
    stream.on('close', () => resolve(Buffer.concat(chunks)));
  });
}

async function executeWithTimeout<T>(
  prom: PromiseLike<T>,
  ms: number,
  err?: Error,
) {
  let timer: NodeJS.Timeout;
  return Promise.race([
    prom,
    new Promise<T>((_res, rej) => (timer = setTimeout(rej, ms, err))),
  ]).finally(() => clearTimeout(timer));
}

interface LanguageProfile {
  /** Docker image name */
  image: string;
  /** Extension of source code file */
  extension: string;
  /** Command line for compilation */
  compile?: string;
  /** Command line for execution */
  execution: string;
}

const languageProfiles: Record<string, LanguageProfile> = {
  'C++11': {
    image: 'lavida-gcc',
    extension: '.cpp',
    compile:
      // -lm: linker option for m library for math.h
      // -O2: Optimization option
      'g++ --std=c++11 -O2 -Wall -lm -static -DONLINE_JUDGE -DLAVIDA -o main main.cpp',
    execution: './main',
  },
  Python3: {
    image: 'lavida-python3',
    extension: '.py',
    execution: 'python3 main.py',
  },
};

@Injectable()
export class JudgeService {
  private docker: Docker;

  constructor(
    private readonly submissionsService: SubmissionsService,
    private readonly problemsService: ProblemsService,
    private readonly configService: ConfigService,
    private readonly userProblemService: UserProblemsService,
  ) {
    this.docker = new Docker();
    this.docker
      .ping()
      .then(() => {
        Logger.log('Docker has been connected.');
      })
      .catch(() => {
        Logger.error('Docker is not connected.');
      });
  }

  private async demux(stream: Duplex): Promise<{
    stdinStream: Writable;
    stdoutStream: Readable;
    stderrStream: Readable;
  }> {
    const stdoutStream = new PassThrough();
    const stderrStream = new PassThrough();

    stream.on('error', (error) => {
      stdoutStream.destroy(error);
      stderrStream.destroy(error);
    });
    stream.on('end', () => {
      stdoutStream.end();
      stderrStream.end();
    });
    stream.on('close', () => {
      stdoutStream.end();
      stderrStream.end();
    });

    this.docker.modem.demuxStream(stream, stdoutStream, stderrStream);

    return {
      stdinStream: stream,
      stdoutStream: stdoutStream,
      stderrStream: stderrStream,
    };
  }

  private async copyFile(
    container: Docker.Container,
    code: string,
    extension: string,
  ) {
    return container
      .exec({
        Cmd: ['/bin/bash', '-c', `cat - > main${extension}`],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: false,
      })
      .then((exec) => exec.start({ hijack: true, stdin: true }))
      .then(this.demux.bind(this))
      .then(async ({ stdinStream }) => {
        stdinStream.write(code);
        stdinStream.end();
      });
  }

  private async compile(container: Docker.Container, cmdline: string) {
    let curExec: Docker.Exec;
    return container
      .exec({
        Cmd: ['/bin/bash', '-c', cmdline],
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
        Tty: false,
      })
      .then((exec) => {
        curExec = exec;
        return exec.start({});
      })
      .then(this.demux.bind(this))
      .then(async ({ stderrStream }) => {
        const stderrOutput = (await readAll(stderrStream)).toString('utf-8');

        const execInfo = await curExec.inspect();

        if (execInfo.ExitCode && execInfo.ExitCode !== 0) {
          throw new CompileError(execInfo.ExitCode, stderrOutput);
        }
      });
  }

  private async execute(
    container: Docker.Container,
    input: string,
    timeLimit: number,
    cmdline: string,
  ) {
    let curExec: Docker.Exec;
    return container
      .exec({
        Cmd: [
          '/bin/bash',
          '-c',
          `timeout ${timeLimit / 1000} /bin/bash -c '${cmdline}'`,
        ],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: false,
      })
      .then((exec) => {
        curExec = exec;
        return exec.start({ hijack: true });
      })
      .then(this.demux.bind(this))
      .then(async ({ stdinStream, stdoutStream, stderrStream }) => {
        stdinStream.write(input);
        stdinStream.end();

        const stdoutOutput = (await readAll(stdoutStream)).toString('utf-8');
        const stderrOutput = (await readAll(stderrStream)).toString('utf-8');

        const execInfo = await curExec.inspect();
        const exitCode = execInfo.ExitCode;

        if (exitCode && exitCode !== 0) {
          if (exitCode == 124) {
            throw new TimeLimitExceededError('Time limit exceeded');
          } else if (exitCode == 125) {
            throw new Error('timeout: timeout command itself fails');
          } else if (exitCode == 126) {
            throw new Error('timeout: COMMAND is found but cannot be invoked');
          } else if (exitCode == 127) {
            throw new Error('timeout: COMMAND cannot be found');
          } else if (exitCode == 137) {
            throw new Error(
              'COMMAND or timeout itself is sent the KILL signal',
            );
          } else {
            throw new RuntimeError(exitCode, stderrOutput);
          }
        }

        return stdoutOutput;
      });
  }

  private async test(
    container: Docker.Container,
    problemId: number,
    timeLimit: number,
    cmdline: string,
    reportProgress: (value: any) => Promise<void>,
  ): Promise<JudgeResult> {
    const dirs = this.configService.get<string[]>('judge.testcaseDirs');

    if (!dirs) {
      throw new Error('judge.testcaseDirs does not exist');
    }

    let dir: string | null = null;
    for (const dirPath of dirs) {
      const curDir = path.resolve(process.cwd(), dirPath, `${problemId}`);
      if (existsSync(curDir)) {
        dir = curDir;
        break;
      }
    }

    if (!dir) {
      throw new Error(`Testcase dir for ${problemId} does not exist.`);
    }

    const files = await readdir(dir);

    const inputFiles = files.filter((file) => path.extname(file) === '.in');

    let status: JudgeStatus = 'ACCEPTED';

    for (const [i, inputFile] of inputFiles.entries()) {
      const outputFile = `${path.basename(inputFile, '.in')}.out`;

      const input = await readFile(path.join(dir, inputFile), 'utf-8');
      const answer = await readFile(path.join(dir, outputFile), 'utf-8');

      const output = await this.execute(container, input, timeLimit, cmdline);

      if (answer.trim() !== output.trim()) {
        status = 'WRONG_ANSWER';
        break;
      }

      reportProgress((i / inputFiles.length) * 100);
    }

    reportProgress(100);

    return {
      status,
      time: 0,
      memory: 0,
    };
  }

  async judge(
    submissionId: number,
    reportProgress: (value: any) => Promise<void>,
  ): Promise<JudgeResult> {
    const submission = await this.submissionsService.findById(submissionId);
    const problem = await this.problemsService.findById(submission.problemId);

    const curLangProfile: LanguageProfile | undefined =
      languageProfiles[submission.language];

    if (!curLangProfile) {
      return {
        status: 'SERVER_ERROR',
        msg: `Language ${submission.language} is not supported`,
      };
    }

    await this.submissionsService.update(submissionId, {
      status: SubmissionStatus.JUDGING,
    });

    let curContainer: Docker.Container;
    const judgeResult: JudgeResult = await this.docker
      .createContainer({
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        OpenStdin: true,
        StdinOnce: true,
        Image: curLangProfile.image,
        Cmd: ['/bin/bash'],
        HostConfig: {
          // Runtime: 'runsc', // Later for gVisor
          // AutoRemove: true,
          // Ulimits: [
          //   // 'as' type is disabled.
          //   {
          //     Name: 'cpu', // POSIX only allows for second precision in setrlimit.
          //     Soft: Math.ceil(problem.timeLimit / 1000),
          //     Hard: Math.ceil(problem.timeLimit / 1000),
          //   },
          // ],
          // Memory: problem.memoryLimit, // Memory limit in bytes
          // MemorySwap: undefined,
          Mounts: [
            // {
            //   Type: 'bind',
            //   Source: '/some/source',
            //   Target: '/some/destination',
            //   ReadOnly: true,
            // },
          ],
        },
      })
      .then((container) => {
        curContainer = container;
        return container.start();
      })
      .then(() =>
        executeWithTimeout(
          this.copyFile(
            curContainer,
            submission.code,
            curLangProfile.extension,
          ),
          2 * 1000,
          new Error('Copying file tooks so long'),
        ),
      )
      .then(() =>
        curLangProfile.compile
          ? executeWithTimeout(
              this.compile(curContainer, curLangProfile.compile),
              2 * 1000,
              new Error('Compilation tooks so long'),
            )
          : undefined,
      )
      .then(() =>
        executeWithTimeout(
          this.test(
            curContainer,
            problem.id,
            problem.timeLimit,
            curLangProfile.execution,
            reportProgress,
          ),
          problem.timeLimit + 2 * 1000,
          new Error('Testing testcases tooks so long'),
        ),
      )
      .catch<JudgeResult>((err) => {
        let judgeStatus: JudgeStatus = 'SERVER_ERROR';

        if (err instanceof CompileError) {
          judgeStatus = 'COMPILE_ERROR';
        } else if (err instanceof RuntimeError) {
          judgeStatus = 'RUNTIME_ERROR';
        } else if (err instanceof TimeLimitExceededError) {
          judgeStatus = 'TIME_LIMIT_EXCEEDED';
        } else if (err instanceof MemoryLimitExceededError) {
          judgeStatus = 'MEMORY_LIMIT_EXCEEDED';
        }

        return {
          status: judgeStatus,
          msg: `${err}`,
        };
      })
      .finally(() => {
        return curContainer
          .stop({ t: 0 })
          .then(() => curContainer.wait())
          .then(() => curContainer.remove());
      });

    let submissionStatus = SubmissionStatus.SUBMITTED;

    switch (judgeResult.status) {
      case 'ACCEPTED':
        submissionStatus = SubmissionStatus.ACCEPTED;
        break;
      case 'WRONG_ANSWER':
        submissionStatus = SubmissionStatus.WRONG_ANSWER;
        break;
      case 'COMPILE_ERROR':
        submissionStatus = SubmissionStatus.COMPILE_ERROR;
        break;
      case 'RUNTIME_ERROR':
        submissionStatus = SubmissionStatus.RUNTIME_ERROR;
        break;
      case 'TIME_LIMIT_EXCEEDED':
        submissionStatus = SubmissionStatus.TIME_LIMIT_EXCEEDED;
        break;
      case 'MEMORY_LIMIT_EXCEEDED':
        submissionStatus = SubmissionStatus.MEMORY_LIMIT_EXCEEDED;
        break;
      case 'SERVER_ERROR':
        submissionStatus = SubmissionStatus.SERVER_ERROR;
        break;
    }

    await this.submissionsService.update(submissionId, {
      status: submissionStatus,
    });

    await this.userProblemService.save(
      submission.userId,
      submission.problemId,
      submissionStatus === SubmissionStatus.ACCEPTED,
    );

    return judgeResult;
  }
}
