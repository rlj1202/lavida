import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationResponseDTO } from 'src/pagination/pagination-response.dto';
import { Repository } from 'typeorm';
import { ListProblemsOptionsDTO } from './dto/list-problems-options.dto';

import { Problem } from './entities/problem.entity';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemsRepository: Repository<Problem>,
  ) {}

  async paginate(
    options: ListProblemsOptionsDTO,
  ): Promise<PaginationResponseDTO<Problem>> {
    const [problems, total] = await this.problemsRepository.findAndCount({
      where: {},
      order: {
        id: { direction: 'ASC' },
      },
      skip: options.offset,
      take: options.limit,
    });

    return new PaginationResponseDTO(problems, total, options);
  }

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
