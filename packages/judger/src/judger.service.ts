import { Injectable } from '@nestjs/common';
import { readdir, readFile } from 'fs/promises';
import path = require('path');
import Docker = require('dockerode');

import { executeWithTimeout } from '@lavida/common/utils/execute-with-timeout.util';

import { DockerService } from '@lavida/docker';

import { LanguageProfile } from '@lavida/core/language-profile/language-profile.interface';
import { languageProfiles } from '@lavida/core/language-profile/language-profiles';

import { JudgeResult } from './interfaces/judge-result.interface';

import { CompileError } from './errors/compile.error';
import { RuntimeError } from './errors/runtime.error';
import { TimeLimitExceededError } from './errors/time-limit-exceeded.error';

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
          curLangProfile.filename,
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
