import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Problem } from '../entities/problem.entity';

import { Submission, SubmissionStatus } from '../entities/submission.entity';
import { UserProblem } from '../entities/user-problem.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionsRepository: Repository<Submission>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Problem)
    private readonly problemsRepository: Repository<Problem>,
    @InjectRepository(UserProblem)
    private readonly userProblemsRepository: Repository<UserProblem>,
  ) {}

  async updateSubmissionStatus(
    submissionId: number,
    status: SubmissionStatus,
    time: number,
    memory: number,
  ): Promise<void> {
    const submission = await this.submissionsRepository.findOneOrFail({
      where: { id: submissionId },
    });

    submission.status = status;
    submission.time = time;
    submission.memory = memory;

    await this.submissionsRepository.save(submission);

    await this.userProblemsRepository.update(
      { userId: submission.userId, problemId: submission.problemId },
      { solved: status === SubmissionStatus.ACCEPTED },
    );

    await this.updateUserStats(submission.userId);
    await this.updateProblemStats(submission.problemId);
  }

  async updateUserStats(userId: number): Promise<void> {
    const submissions = await this.submissionsRepository.find({
      where: {
        userId,
      },
      select: {
        status: true,
      },
    });

    await this.usersRepository.update(userId, {
      submissionCount: submissions.length,
      acceptCount: submissions.filter(
        (submission) => submission.status === SubmissionStatus.ACCEPTED,
      ).length,
    });
  }

  async updateProblemStats(problemId: number): Promise<void> {
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
