import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';

import { ValidateSubmissionRequestDto } from '@lavida/core/dtos/validate-submission-request.dto';

import { SubmissionStatus } from '@lavida/core/entities/submission.entity';

import { AppService } from './app.service';
import { KAFKA_CLIENT_TOKEN } from './app.constant';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(KAFKA_CLIENT_TOKEN)
    private readonly client: ClientKafka,
  ) {}

  @EventPattern('validate-submission')
  async validateSubmission(@Payload() dto: ValidateSubmissionRequestDto) {
    Logger.verbose(`Validate-submission: ${dto.submissionId}`);

    try {
      await this.appService.updateSubmissionStatus(
        dto.submissionId,
        SubmissionStatus.JUDGING,
      );

      const needCompile = await this.appService.doesNeedCompile(dto.language);

      if (needCompile) {
        this.client.emit('compile', {
          ...dto,
        });
      } else {
        this.client.emit('validate', {
          ...dto,
        });
      }
    } catch (e) {
      // TODO:
      console.log(e);
    }
  }
}
