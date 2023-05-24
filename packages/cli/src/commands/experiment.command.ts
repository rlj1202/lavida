import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Command, CommandRunner } from 'nest-commander';

import { KAFKA_CLIENT_TOKEN } from '../app.constants';

@Command({ name: 'experiment', subCommands: [] })
export class ExperimentCommand extends CommandRunner {
  constructor(
    @Inject(KAFKA_CLIENT_TOKEN)
    private readonly clientProxy: ClientKafka,
  ) {
    super();
  }

  async run(
    _passedParams: string[],
    _options?: Record<string, any>,
  ): Promise<void> {
    return;
  }
}
