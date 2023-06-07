import { ValidateSubmissionRequestDto } from '@lavida/core/dtos/validate-submission-request.dto';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Docker = require('dockerode');
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

import { languageProfiles } from '@lavida/core/language-profile/language-profiles';
import { LanguageProfile } from '@lavida/core/language-profile/language-profile.interface';

import { DockerService } from '@lavida/docker/docker.service';

import { TimeLimitExceededError } from '@lavida/judger/errors/time-limit-exceeded.error';
import { RuntimeError } from '@lavida/judger/errors/runtime.error';

export interface JudgeResult {
  accepted: boolean;

  /** In milli seconds */
  time: number;

  /** In bytes */
  memory: number;
}

@Injectable()
export class AppService {
  private testcaseRootDirs: string[];

  constructor(
    private readonly client: Docker,
    private readonly dockerService: DockerService,
    configService: ConfigService,
  ) {
    this.testcaseRootDirs = configService
      .getOrThrow<string>('TESTCASE_DIRS')
      .split(',');

    Logger.verbose(`Testcase root dirs: ${this.testcaseRootDirs.join(', ')}`);
  }

  resolveTestcaseDir(problemId: number) {
    const dir = this.testcaseRootDirs
      .map((dirPath) => path.resolve(process.cwd(), dirPath, `${problemId}`))
      .find((dirPath) => fs.existsSync(dirPath));

    if (!dir) {
      throw new Error(`Testcase dir for ${problemId} does not exist.`);
    }

    return dir;
  }

  async validate(
    dto: ValidateSubmissionRequestDto & { executable?: string },
  ): Promise<JudgeResult> {
    const curLangProfile: LanguageProfile | undefined =
      languageProfiles[dto.language];

    if (!curLangProfile) {
      throw new Error(`not supported language: ${dto.language}`);
    }

    const testcasedir = this.resolveTestcaseDir(dto.problemId);

    const container = await this.client.createContainer({
      Tty: true,
      Image: curLangProfile.image,
      Cmd: ['/bin/bash'],
      HostConfig: {
        Memory: dto.memoryLimit,
        MemorySwap: dto.memoryLimit,
      },
    });

    try {
      await container.start();

      if (dto.executable) {
        const buffer = Buffer.from(dto.executable, 'base64');

        console.log(`Byte length: ${buffer.byteLength}`);

        // Upload executable file and make it executable
        await this.dockerService.putFile(
          container,
          curLangProfile.executable,
          buffer,
          './',
        );

        await this.dockerService.execute(container, {
          cmd: ['chmod', '+x', curLangProfile.executable],
        });
      }

      //
      const files = await readdir(testcasedir);
      const inputFiles = files.filter((file) => path.extname(file) === '.in');

      let accepted = true;

      for await (const [_, inputFile] of inputFiles.entries()) {
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
          timeLimit: dto.timeLimit,
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
      }

      return {
        accepted,
        time: 0,
        memory: 0,
      };
    } catch (e) {
      throw e;
    } finally {
      await container.stop({ t: 0 });
      await container.wait();
      await container.remove();
    }
  }
}
