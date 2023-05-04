import { Injectable } from '@nestjs/common';
import { readdir, readFile } from 'fs/promises';
import path = require('path');
import Docker = require('dockerode');

import { executeWithTimeout } from '@lavida/common/utils/execute-with-timeout.util';

import { DockerService } from '@lavida/docker/docker.service';

export class CompileError extends Error {
  constructor(public exitCode: number, msg?: string) {
    super(msg);
    this.name = 'CompileError';
  }
}

export class RuntimeError extends Error {
  constructor(public exitCode: number, msg?: string) {
    super(msg);
    this.name = 'RuntimeError';
  }
}

export class TimeLimitExceededError extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = 'TimeLimitExceededError';
  }
}

export class MemoryLimitExceededError extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = 'MemoryLimitExceededError';
  }
}

export interface JudgeResult {
  accepted: boolean;

  /** In milli seconds */
  time: number;

  /** In bytes */
  memory: number;
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
export class Judger {
  constructor(
    private readonly docker: Docker,
    private readonly dockerService: DockerService,
  ) {}

  async judge(
    language: string,
    sourcecode: string,
    testcasedir: string,
    timeLimit: number,
    memoryLimit: number,
    reportProgress: (value: any) => Promise<void>,
  ): Promise<JudgeResult> {
    const curLangProfile: LanguageProfile | undefined =
      languageProfiles[language];

    if (!curLangProfile) {
      throw new Error(`not supported language: ${language}`);
    }

    // Create container
    const container: Docker.Container = await this.docker.createContainer({
      Tty: true,
      Image: curLangProfile.image,
      Cmd: ['/bin/bash'],
      HostConfig: {
        // Runtime: 'runsc', // Later for gVisor
        // Ulimits: [
        //   // 'as' type is disabled.
        //   {
        //     Name: 'cpu', // POSIX only allows for second precision in setrlimit.
        //     Soft: Math.ceil(problem.timeLimit / 1000),
        //     Hard: Math.ceil(problem.timeLimit / 1000),
        //   },
        // ],
        // Memory: 0, // Memory limits in bytes
        // MemorySwap: 0,
      },
    });

    try {
      await container.start();

      // Upload file
      await executeWithTimeout(
        this.dockerService.putFile(
          container,
          `main${curLangProfile.extension}`,
          sourcecode,
          '/',
        ),
        2 * 1000,
        new Error('Copying file tooks so long'),
      );

      // Compile file
      if (curLangProfile.compile) {
        const result = await this.dockerService.execute(container, {
          cmd: ['/bin/bash', '-c', curLangProfile.compile],
        });

        if (result.exitCode && result.exitCode !== 0) {
          throw new CompileError(result.exitCode, result.stdoutOutput);
        }
      }

      // Test
      const files = await readdir(testcasedir);
      const inputFiles = files.filter((file) => path.extname(file) === '.in');

      let accepted = true;

      for (const [i, inputFile] of inputFiles.entries()) {
        const outputFile = `${path.basename(inputFile, '.in')}.out`;

        const input = await readFile(
          path.join(testcasedir, inputFile),
          'utf-8',
        );
        const output = await readFile(
          path.join(testcasedir, outputFile),
          'utf-8',
        );

        const result = await this.dockerService.execute(container, {
          cmd: [curLangProfile.execution],
          input: input,
          timeLimit: timeLimit,
        });

        if (result.exitCode && result.exitCode !== 0) {
          if (result.exitCode === 124) {
            throw new TimeLimitExceededError('Time limit exceeded');
          } else if (result.exitCode === 125) {
            throw new Error('timeout: timeout command itself fails');
          } else if (result.exitCode == 126) {
            throw new Error('timeout: COMMAND is found but cannot be invoked');
          } else if (result.exitCode == 127) {
            throw new Error('timeout: COMMAND cannot be found');
          } else if (result.exitCode == 137) {
            throw new Error(
              'COMMAND or timeout itself is sent the KILL signal',
            );
          } else {
            throw new RuntimeError(result.exitCode, result.stderrOutput);
          }
        }

        if (output.trim() !== result.stdoutOutput.trim()) {
          accepted = false;
          break;
        }

        reportProgress((i / inputFiles.length) * 100);
      }

      reportProgress(100);

      return {
        accepted,
        time: 0,
        memory: 0,
      };
    } catch (e) {
      throw e;
    } finally {
      // Clean up
      await container.stop({ t: 0 });
      await container.wait();
      await container.remove();
    }
  }
}
