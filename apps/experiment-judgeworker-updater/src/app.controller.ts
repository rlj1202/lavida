import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { AppService, UpdateSubmissionDto } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('update')
  async update(@Payload() dto: UpdateSubmissionDto) {
    Logger.verbose(`Update: ${JSON.stringify(dto)}`);

    await this.appService.update(dto);
  }
}
