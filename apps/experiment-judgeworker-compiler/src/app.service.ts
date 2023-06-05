import { ValidateSubmissionRequestDto } from '@lavida/core/dtos/validate-submission-request.dto';
import { Injectable } from '@nestjs/common';

import Docker = require('dockerode');

import { DockerService } from '@lavida/docker/docker.service';
import { languageProfiles } from '@lavida/core/language-profile/language-profiles';
import { executeWithTimeout } from '@lavida/common/utils/execute-with-timeout.util';
import { LanguageProfile } from '@lavida/core/language-profile/language-profile.interface';

import { CompileError } from '@lavida/judger/errors';

@Injectable()
export class AppService {
  constructor(
    private readonly docker: Docker,
    private readonly dockerService: DockerService,
  ) {}

  async compile(dto: ValidateSubmissionRequestDto): Promise<Buffer> {
    const curLangProfile: LanguageProfile | undefined =
      languageProfiles[dto.language];

    if (!curLangProfile) {
      throw new Error(`not supported language: ${dto.language}`);
    }

    const container = await this.docker.createContainer({
      Tty: true,
      Image: curLangProfile.image,
      Cmd: ['/bin/bash'],
    });

    try {
      await container.start();

      // Upload source code file
      await executeWithTimeout(
        this.dockerService.putFile(
          container,
          curLangProfile.filename,
          dto.code,
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
          throw new CompileError(result.exitCode, result.stderrOutput);
        }
      }

      // Retreive compiled binary file
      const executable = await this.dockerService.getFile(
        container,
        curLangProfile.executable,
      );

      return executable;
    } catch (e) {
      throw e;
    } finally {
      await container.stop({ t: 0 });
      await container.wait();
      await container.remove();
    }
  }
}
