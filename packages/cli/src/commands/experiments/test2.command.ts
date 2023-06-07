import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { CommandRunner, SubCommand } from 'nest-commander';
import { Repository } from 'typeorm';
import { lastValueFrom } from 'rxjs';

import { ValidateSubmissionRequestDto } from '@lavida/core/dtos/validate-submission-request.dto';

import { Solution } from './entities/solution.entity';
import { languages } from './languages';

import { KAFKA_CLIENT_TOKEN } from '../../app.constants';

@SubCommand({ name: 'test2' })
export class Test2Command extends CommandRunner {
  constructor(
    @InjectRepository(Solution, 'lavida-old')
    private readonly solutionsRepository: Repository<Solution>,
    @Inject(KAFKA_CLIENT_TOKEN)
    private readonly client: ClientKafka,
  ) {
    super();
  }

  async run(
    _passedParams: string[],
    _options?: Record<string, any>,
  ): Promise<void> {
    const solutionsCnt = await this.solutionsRepository.count({});

    console.log(`Total submissions: ${solutionsCnt}`);

    const solutions = await this.solutionsRepository.find({
      relations: {
        source: true,
        problem: true,
      },
      skip: 0,
      take: 20,
    });

    const requests = solutions.map(
      (solution) =>
        <ValidateSubmissionRequestDto>{
          submissionId: solution.solution_id,
          code: solution.source.source,
          language: languages[solution.language],
          problemId: solution.problem_id + 10000,
          memoryLimit: solution.problem.memory_limit * 1024 * 1024,
          timeLimit: solution.problem.time_limit * 1000,
        },
    );
    await Promise.all(
      requests.map((req) =>
        lastValueFrom(this.client.emit('validate-submission', req)),
      ),
    );

    console.log('All requests have been emitted.');

    return;
  }
}
