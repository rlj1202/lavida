import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';

import { ValidateSubmissionRequestDto } from '@lavida/core/dtos/validate-submission-request.dto';

import { AppService } from './app.service';
import { KAFKA_CLIENT_TOKEN } from './app.constant';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(KAFKA_CLIENT_TOKEN)
    private readonly client: ClientKafka,
  ) {}

  @EventPattern('compile')
  async compile(@Payload() dto: ValidateSubmissionRequestDto) {
    Logger.verbose(`Compile...: ${JSON.stringify(dto)}`);

    const buffer = await this.appService.compile(dto);

    Logger.verbose(`Compile finished: ${buffer.byteLength}`);

    const validateDto: ValidateSubmissionRequestDto & { executable: string } = {
      ...dto,
      executable: buffer.toString('base64'),
    };

    this.client.emit('validate', validateDto);

    Logger.verbose('Compile finished, emit validate event');
  }
}
