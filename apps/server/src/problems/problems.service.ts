import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { ListProblemsOptionsDTO } from './dto/list-problems-options.dto';
import { SearchProblemsDTO } from './dto/search-problems.dto';

import {
  Submission,
  SubmissionStatus,
} from 'src/submissions/entities/submission.entity';
import { Problem } from './entities/problem.entity';
import { UserProblemsService } from 'src/userProblems/user-problems.service';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemsRepository: Repository<Problem>,
    @InjectRepository(Submission)
    private readonly submissionsRepository: Repository<Submission>,
    private readonly userProblemService: UserProblemsService,
  ) {}

  async paginate(
    options: ListProblemsOptionsDTO,
  ): Promise<PaginationResponseDto<Problem>> {
    const [problems, total] = await this.problemsRepository.findAndCount({
      where: {},
      order: {
        id: { direction: 'ASC' },
      },
      skip: options.offset,
      take: options.limit,
    });

    return new PaginationResponseDto(problems, total, options);
  }

  async findAll(): Promise<Problem[]> {
    const problems = await this.problemsRepository.find();

    return problems;
  }

  async findById(id: number): Promise<Problem> {
    const problem = await this.problemsRepository.findOneOrFail({
      where: { id },
    });

    return problem;
  }

  async updateStats(problemId: number) {
    const submissions = await this.submissionsRepository.find({
      where: {
        problemId,
      },
      select: {
        status: true,
      },
    });

    await this.problemsRepository.update(problemId, {
      submissionCount: submissions.length,
      acceptCount: submissions.filter(
        (submission) => submission.status === SubmissionStatus.ACCEPTED,
      ).length,
    });
  }

  async search(
    options: SearchProblemsDTO,
  ): Promise<PaginationResponseDto<Problem>> {
    const [result, count] = await this.problemsRepository
      .createQueryBuilder()
      .select()
      .where('MATCH(title) AGAINST(:query IN BOOLEAN MODE)', {
        query: options.query,
      })
      .orWhere('MATCH(description) AGAINST(:query IN BOOLEAN MODE)', {
        query: options.query,
      })
      .skip(options.offset)
      .take(options.limit)
      .getManyAndCount();

    return {
      items: result,
      limit: options.limit,
      offset: options.offset,
      total: count,
    };
  }
}
