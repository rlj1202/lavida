import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Problem } from '@lavida/core/entities/problem.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(Problem)
    private readonly problemsRepository: Repository<Problem>,
  ) {}

  async onModuleInit() {
    const problems = await this.problemsRepository.find({});

    Logger.log(`Number of problems: ${problems.length}`);
  }
}
