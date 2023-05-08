import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import path = require('path');

import { SubmissionStatus } from '@lavida/core/entities/submission.entity';

import { SubmissionsService } from '@lavida/server/submissions/submissions.service';
import { ProblemsService } from '@lavida/server/problems/problems.service';
import { UserProblemsService } from '@lavida/server/userProblems/user-problems.service';
import { UsersService } from '@lavida/server/users/users.service';
import { AppConfigType } from '@lavida/server/config';
import {
  CompileError,
  Judger,
  MemoryLimitExceededError,
  RuntimeError,
  TimeLimitExceededError,
} from '@lavida/judger';

export interface SubmissionResult {
  status: SubmissionStatus;
  time: number;
  memory: number;
}

@Injectable()
export class JudgeService implements OnModuleInit {
  private readonly logger = new Logger(JudgeService.name);

  constructor(
    private readonly configService: ConfigService<AppConfigType>,
    private readonly usersService: UsersService,
    private readonly problemsService: ProblemsService,
    private readonly userProblemService: UserProblemsService,
    private readonly submissionsService: SubmissionsService,
    private readonly judger: Judger,
  ) {}

  async onModuleInit() {
    const testcaseDirs = this.configService.get<string[]>('judge.testcaseDirs');
    this.logger.verbose(`Testcase dirs: ${testcaseDirs}`);
  }

  resolveTestcaseDir(problemId: number) {
    const dirs = this.configService.get<string[]>('judge.testcaseDirs');

    if (!dirs) {
      throw new Error('judge.testcaseDirs does not exist');
    }

    let dir: string | null = null;
    for (const dirPath of dirs) {
      const curDir = path.resolve(process.cwd(), dirPath, `${problemId}`);
      if (existsSync(curDir)) {
        dir = curDir;
        break;
      }
    }

    if (!dir) {
      throw new Error(`Testcase dir for ${problemId} does not exist.`);
    }

    return dir;
  }

  async judge(
    submissionId: number,
    reportProgress: (value: any) => Promise<void>,
  ): Promise<SubmissionResult> {
    const submission = await this.submissionsService.findById(submissionId);
    const problem = await this.problemsService.findById(submission.problemId);

    let finalStatus: SubmissionStatus = SubmissionStatus.SERVER_ERROR;
    let time = 0;
    let memory = 0;

    try {
      await this.submissionsService.update(submissionId, {
        status: SubmissionStatus.JUDGING,
      });

      const result = await this.judger.judge(
        submission.language,
        submission.code,
        this.resolveTestcaseDir(problem.id),
        problem.timeLimit,
        problem.memoryLimit,
        reportProgress,
      );

      finalStatus = result.accepted
        ? SubmissionStatus.ACCEPTED
        : SubmissionStatus.WRONG_ANSWER;

      time = result.time;
      memory = result.memory;
    } catch (e) {
      if (e instanceof CompileError) {
        finalStatus = SubmissionStatus.COMPILE_ERROR;
      } else if (e instanceof RuntimeError) {
        finalStatus = SubmissionStatus.RUNTIME_ERROR;
      } else if (e instanceof TimeLimitExceededError) {
        finalStatus = SubmissionStatus.TIME_LIMIT_EXCEEDED;
      } else if (e instanceof MemoryLimitExceededError) {
        finalStatus = SubmissionStatus.MEMORY_LIMIT_EXCEEDED;
      } else {
        finalStatus = SubmissionStatus.SERVER_ERROR;
      }
    } finally {
      await this.submissionsService.update(submissionId, {
        status: finalStatus,
        time: time,
        memory: memory,
      });

      await this.userProblemService.save(
        submission.userId,
        submission.problemId,
        finalStatus === SubmissionStatus.ACCEPTED,
      );

      await this.usersService.updateStats(submission.userId);
      await this.problemsService.updateStats(submission.problemId);
    }

    return {
      status: finalStatus,
      time,
      memory,
    };
  }
}
