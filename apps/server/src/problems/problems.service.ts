import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Problem } from './entities/problem.entity';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemsRepository: Repository<Problem>,
  ) {}

  async findAll(): Promise<Problem[]> {
    const problems = await this.problemsRepository.find();

    return problems;
  }

  async findById(id: number): Promise<Problem> {
    const problem = await this.problemsRepository.findOne({ where: { id } });

    if (!problem) {
      throw new HttpException('Problem not found.', HttpStatus.NOT_FOUND);
    }

    return problem;
  }
}
