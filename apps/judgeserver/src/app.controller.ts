import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ValidateSubmissionRequestDto } from '@lavida/core/dtos/validate-submission-request.dto';
import { JudgeRequestDto } from '@lavida/core/dtos/judge-request.dto';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('judge')
  async judge(@Payload() dto: JudgeRequestDto) {
    // TODO:
    const reportProgress = async (value: any) => {
      Logger.verbose(`Judge progress: ${value}`);
    };

    const result = await this.appService.judge(dto, reportProgress);

    Logger.verbose(`Judge result: ${JSON.stringify(result)}`);

    return result;
  }

  @MessagePattern('validate-submission')
  async validateSubmission(@Payload() dto: ValidateSubmissionRequestDto) {
    // TODO:
    const reportProgress = async (value: any) => {
      Logger.verbose(`Validating submission progress: ${value}`);
    };

    const result = await this.appService.validateSubmission(
      dto,
      reportProgress,
    );

    Logger.verbose(`Validating submission result: ${JSON.stringify(result)}`);

    return result;
  }
}
