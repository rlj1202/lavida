import { Duplex, PassThrough, Readable, Stream, Writable } from 'stream';
import { Injectable, Logger } from '@nestjs/common';
import path = require('path');
import { readdir, readFile } from 'fs/promises';
import Docker = require('dockerode');

import { SubmissionsService } from 'src/submissions/submissions.service';
import { ProblemsService } from 'src/problems/problems.service';

export type JudgeStatus =
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'COMPILE_ERROR'
  | 'RUNTIME_ERROR'
  | 'SERVER_ERROR';

export interface JudgeResult {
  status: JudgeStatus;
  /** In milli seconds */
  time: number;
  /** In bytes */
  memory: number;
  msg?: string;
}

// TODO: Move to configuration module... or something else
const TESTCASE_DIR = path.join(process.cwd(), 'data/testcases');

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

@Injectable()
export class JudgeService {
  private docker: Docker;

  constructor(
    private readonly submissionsService: SubmissionsService,
    private readonly problemsService: ProblemsService,
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

  private async copyFile(container: Docker.Container, code: string) {
    const extension = '.cpp';

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

  private async compile(container: Docker.Container) {
    return container
      .exec({
        Cmd: ['/bin/bash', '-c', 'g++ -o main main.cpp'],
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
        Tty: false,
      })
      .then((exec) => exec.start({}))
      .then(this.demux.bind(this))
      .then(async ({ stderrStream }) => {
        const stderrOutput = (await readAll(stderrStream)).toString('utf-8');
        if (stderrOutput) {
          throw new Error(stderrOutput);
        }
      });
  }

  private async execute(container: Docker.Container, input: string) {
    return container
      .exec({
        Cmd: ['/bin/bash', '-c', './main'],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: false,
      })
      .then((exec) => exec.start({ hijack: true }))
      .then(this.demux.bind(this))
      .then(async ({ stdinStream, stdoutStream, stderrStream }) => {
        stdinStream.write(input);
        stdinStream.end();

        const stdoutOutput = (await readAll(stdoutStream)).toString('utf-8');
        const stderrOutput = (await readAll(stderrStream)).toString('utf-8');

        if (stderrOutput) {
          throw new Error(stderrOutput);
        }

        return stdoutOutput;
      });
  }

  private async test(
    container: Docker.Container,
    problemId: number,
  ): Promise<JudgeResult> {
    const dir = path.join(TESTCASE_DIR, `${problemId}`);
    const files = await readdir(dir);

    const inputFiles = files.filter((file) => path.extname(file) === '.in');

    let status: JudgeStatus = 'ACCEPTED';

    for (const inputFile of inputFiles) {
      const outputFile = `${path.basename(inputFile, '.in')}.out`;

      const input = await readFile(path.join(dir, inputFile), 'utf-8');
      const answer = await readFile(path.join(dir, outputFile), 'utf-8');

      const output = await this.execute(container, input);

      if (answer.trim() !== output.trim()) {
        status = 'WRONG_ANSWER';
        break;
      }
    }

    return {
      status,
      time: 0,
      memory: 0,
    };
  }

  async judge(submissionId: number): Promise<JudgeResult> {
    const submission = await this.submissionsService.findById(submissionId);
    const problem = await this.problemsService.findById(submission.problemId);

    let curContainer: Docker.Container;
    const judgeResult: JudgeResult = await this.docker
      .createContainer({
        AttachStdin: false,
        AttachStdout: true,
        AttachStderr: true,
        Tty: true,
        OpenStdin: true,
        StdinOnce: true,
        Image: 'lavida-gcc',
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
          this.copyFile(curContainer, submission.code),
          2 * 1000,
          new Error('Copying file tooks so long'),
        ),
      )
      .then(() =>
        executeWithTimeout(
          this.compile(curContainer),
          2 * 1000,
          new Error('Compilation tooks so long'),
        ),
      )
      .then(() =>
        executeWithTimeout(
          this.test(curContainer, problem.id),
          2 * 1000,
          new Error('Testing testcases tooks so long'),
        ),
      )
      .catch<JudgeResult>((err) => {
        return {
          status: 'SERVER_ERROR',
          time: 0,
          memory: 0,
          msg: `${err}`,
        };
      })
      .finally(() => {
        return curContainer
          .stop({ t: 0 })
          .then(() => curContainer.wait())
          .then(() => curContainer.remove());
      });

    // TODO:
    await this.submissionsService.update(submissionId);

    return judgeResult;
  }
}
