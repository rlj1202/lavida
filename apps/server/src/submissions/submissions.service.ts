import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProblemsService } from 'src/problems/problems.service';
import { UsersService } from 'src/users/users.service';

import { SubmitDto } from './dto/submit.dto';
import { Submission } from './entities/submission.entity';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { JudgeJob } from 'src/judge/judge.job';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionsRepository: Repository<Submission>,
    private readonly usersService: UsersService,
    private readonly problemsService: ProblemsService,
    @InjectQueue('judge')
    private readonly judgeQueue: Queue<JudgeJob>,
  ) {}

  async findById(id: number): Promise<Submission> {
    const submission = await this.submissionsRepository.findOne({
      where: { id },
    });

    if (!submission) {
      throw new HttpException('Submission not found', HttpStatus.NOT_FOUND);
    }

    return submission;
  }

  async submit(userId: number, submitDto: SubmitDto): Promise<Submission> {
    const problem = await this.problemsService.findById(submitDto.problemId);
    const user = await this.usersService.findById(userId);

    const submission = this.submissionsRepository.create({
      problem,
      user,
      code: submitDto.code,
      language: submitDto.language,
    });

    await this.submissionsRepository.save(submission);

    await this.judgeQueue.add({
      problemId: problem.id,
      submissionId: submission.id,
      code: submission.code,
      language: submission.language,
    });

    return submission;
  }

  async update(id: number): Promise<Submission> {
    const submission = await this.findById(id);

    // TODO:

    await this.submissionsRepository.save(submission);

    return submission;
  }
}
