import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginationResponseDTO } from 'src/pagination/pagination-response.dto';
import { ListProblemsOptionsDTO } from './dto/list-problems-options.dto';

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
}
