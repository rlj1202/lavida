import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueProgress,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { JudgeGateway } from './judge.gateway';

import { JudgeJob } from './judge.job';
import { JudgeService, SubmissionResult } from './judge.service';
import { SubmissionStatus } from '@lavida/core/entities/submission.entity';

@Processor('judge')
export class JudgeProcessor {
  private readonly logger = new Logger(JudgeProcessor.name);

  constructor(
    private readonly judgeService: JudgeService,
    private readonly judgeGateway: JudgeGateway,
  ) {}

  @Process()
  async judge(job: Job<JudgeJob>): Promise<SubmissionResult> {
    const result = await this.judgeService.judge(
      job.data.submissionId,
      (value: any) => job.progress(value),
    );

    return result;
  }

  @OnQueueActive()
  onActive(job: Job<JudgeJob>) {
    const { data } = job;
    this.logger.log(
      `Judging submission id ${data.submissionId} on problem id ${data.problemId} in ${data.language} language...`,
    );
  }

  @OnQueueProgress()
  onProgress(job: Job<JudgeJob>, progress: number) {
    const { data } = job;
    this.logger.log(
      `Job for submission id ${data.submissionId} progress: ${progress}`,
    );
    this.judgeGateway.reportStatus(
      data.submissionId,
      progress,
      SubmissionStatus.JUDGING,
    );
    return;
  }

  @OnQueueCompleted()
  onCompleted(job: Job<JudgeJob>, result: SubmissionResult) {
    const { data } = job;
    this.logger.log(
      `Judging on submission id ${
        data.submissionId
      } has been completed with result ${JSON.stringify(result)}.`,
    );
    this.judgeGateway.reportStatus(data.submissionId, 100, result.status);
  }
}
