import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { Command, CommandRunner } from 'nest-commander';
import { lastValueFrom } from 'rxjs';

import { ValidateSubmissionRequestDto } from '@lavida/core/dtos/validate-submission-request.dto';

import { Test1Command } from './experiments/test1.command';
import { Test2Command } from './experiments/test2.command';

import { KAFKA_CLIENT_TOKEN } from '../app.constants';

@Command({
  name: 'experiment',
  subCommands: [Test1Command, Test2Command],
})
export class ExperimentCommand extends CommandRunner {
  constructor(
    @Inject(KAFKA_CLIENT_TOKEN)
    private readonly client: ClientKafka,
  ) {
    super();
  }

  async run(
    _passedParams: string[],
    _options?: Record<string, any>,
  ): Promise<void> {
    const code = `
    #include <stdio.h>

    int main() {
      int A, B;
      scanf("%d %d", &A, &B);
      printf("%d\\n", A + B);

      return 0;
    }
    `;

    const source = this.client.emit('validate-submission', <
      ValidateSubmissionRequestDto
    >{
      code: code,
      language: 'C++11',
      problemId: 11000,
      submissionId: 1,
      timeLimit: 1000,
      memoryLimit: 256 * 1024 * 1024,
    });

    console.log(await lastValueFrom(source));
  }
}
