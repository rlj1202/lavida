import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { KAFKA_CLIENT_TOKEN } from './app.constant';

import { ValidateSubmissionRequestDto } from '@lavida/core/dtos/validate-submission-request.dto';
import { SubmissionStatus } from '@lavida/core/entities/submission.entity';

import { TimeLimitExceededError } from '@lavida/judger/errors/time-limit-exceeded.error';
import { RuntimeError } from '@lavida/judger/errors/runtime.error';
import { MemoryLimitExceededError } from '@lavida/judger/errors/memory-limit-exceeded.error';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(KAFKA_CLIENT_TOKEN)
    private readonly client: ClientKafka,
  ) {}

  @EventPattern('validate')
  async validate(
    @Payload() dto: ValidateSubmissionRequestDto & { executable?: string },
  ) {
    Logger.verbose(`Validate ${dto.submissionId}`);

    let finalStatus: SubmissionStatus;
    let time = 0;
    let memory = 0;

    try {
      const result = await this.appService.validate(dto);

      finalStatus = result.accepted
        ? SubmissionStatus.ACCEPTED
        : SubmissionStatus.WRONG_ANSWER;
      time = result.time;
      memory = result.memory;
    } catch (e) {
      if (e instanceof TimeLimitExceededError) {
        finalStatus = SubmissionStatus.TIME_LIMIT_EXCEEDED;
      } else if (e instanceof MemoryLimitExceededError) {
        finalStatus = SubmissionStatus.MEMORY_LIMIT_EXCEEDED;
      } else if (e instanceof RuntimeError) {
        finalStatus = SubmissionStatus.RUNTIME_ERROR;
      } else {
        finalStatus = SubmissionStatus.SERVER_ERROR;
      }

      Logger.verbose(e);
    } finally {
      const updateDto = {
        submissionId: dto.submissionId,
        status: finalStatus,
        time: time,
        memory: memory,
      };

      this.client.emit('update', updateDto);

      Logger.verbose(
        `Validate finished for ${dto.submissionId}, emit update event`,
      );
    }
  }
}
