import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import path from 'path';

import {
  Submission,
  SubmissionStatus,
} from '@lavida/core/entities/submission.entity';

import {
  CompileError,
  Judger,
  MemoryLimitExceededError,
  RuntimeError,
  TimeLimitExceededError,
} from '@lavida/judger';
import { StatsService } from '@lavida/core/stats';

import { ValidateSubmissionRequestDto } from '@lavida/core/dtos/validate-submission-request.dto';
import { ValidateSubmissionResponseDto } from '@lavida/core/dtos/validate-submission-response.dto';
import { JudgeRequestDto } from '@lavida/core/dtos/judge-request.dto';
import { JudgeResponseDto } from '@lavida/core/dtos/judge-response.dto';

@Injectable()
export class AppService {
  constructor(
    private readonly judger: Judger,
    private readonly configService: ConfigService,
    private readonly statsService: StatsService,
    @InjectRepository(Submission)
    private readonly submissionsRepository: Repository<Submission>,
  ) {}

  async judge(
    dto: JudgeRequestDto,
    reportProgress: (value: any) => Promise<void>,
  ): Promise<JudgeResponseDto> {
    const testcaseDir = this.configService.get<string>('TESTCASE_DIR');

    try {
      const result = await this.judger.judge(
        dto.language,
        dto.code,
        path.join(testcaseDir, `${dto.problemId}`),
        dto.timeLimit,
        dto.memoryLimit,
        reportProgress,
      );

      return result;
    } catch (e) {
      // TODO:
      if (e instanceof CompileError) {
        // finalStatus = SubmissionStatus.COMPILE_ERROR;
      } else if (e instanceof RuntimeError) {
        // finalStatus = SubmissionStatus.RUNTIME_ERROR;
      } else if (e instanceof TimeLimitExceededError) {
        // finalStatus = SubmissionStatus.TIME_LIMIT_EXCEEDED;
      } else if (e instanceof MemoryLimitExceededError) {
        // finalStatus = SubmissionStatus.MEMORY_LIMIT_EXCEEDED;
      } else if (e instanceof Error) {
        // finalStatus = SubmissionStatus.SERVER_ERROR;
      } else {
        // finalStatus = SubmissionStatus.SERVER_ERROR;
      }

      return {
        accepted: false,
        time: 0,
        memory: 0,
      };
    }
  }

  async validateSubmission(
    dto: ValidateSubmissionRequestDto,
    reportProgress: (value: any) => Promise<void>,
  ): Promise<ValidateSubmissionResponseDto> {
    let finalStatus: SubmissionStatus = SubmissionStatus.SERVER_ERROR;
    let time = 0;
    let memory = 0;

    try {
      await this.submissionsRepository.update(dto.submissionId, {
        status: SubmissionStatus.JUDGING,
      });

      const result = await this.judge(dto, reportProgress);

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
      await this.statsService.updateSubmissionStatus(
        dto.submissionId,
        finalStatus,
        time,
        memory,
      );

      return {
        status: finalStatus,
        time: 0,
        memory: 0,
      };
    }
  }
}
