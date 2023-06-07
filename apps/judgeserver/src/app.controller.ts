import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

import { ValidateSubmissionRequestDto } from '@lavida/core/dtos/validate-submission-request.dto';
import { JudgeRequestDto } from '@lavida/core/dtos/judge-request.dto';

import { AppService } from './app.service';

import { KAFKA_CLIENT_TOKEN } from './app.constant';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(KAFKA_CLIENT_TOKEN)
    private readonly client: ClientKafka,
  ) {}

  @MessagePattern('judge')
  async judge(@Payload() dto: JudgeRequestDto) {
    const reportProgress = async (value: any) => {
      this.client.emit('judge.progress', value);
    };

    const result = await this.appService.judge(dto, reportProgress);

    Logger.verbose(`Judge result: ${JSON.stringify(result)}`);

    return result;
  }

  @MessagePattern('validate-submission')
  async validateSubmission(@Payload() dto: ValidateSubmissionRequestDto) {
    const reportProgress = async (value: any) => {
      this.client.emit('validate-submission.progress', value);
    };

    const result = await this.appService.validateSubmission(
      dto,
      reportProgress,
    );

    Logger.verbose(`Validating submission result: ${JSON.stringify(result)}`);

    return result;
  }
}
