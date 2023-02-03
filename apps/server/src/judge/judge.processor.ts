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
import { JudgeResult, JudgeService } from './judge.service';

const LOG_CONTEXT = 'JudgeProcessor';

@Processor('judge')
export class JudgeProcessor {
  constructor(
    private readonly judgeService: JudgeService,
    private readonly judgeGateway: JudgeGateway,
  ) {}

  @Process()
  async judge(job: Job<JudgeJob>): Promise<JudgeResult> {
    const judgeResult = await this.judgeService.judge(
      job.data.submissionId,
      (value: any) => job.progress(value),
    );

    return judgeResult;
  }

  @OnQueueActive()
  onActive(job: Job<JudgeJob>) {
    const { data } = job;
    Logger.log(
      `Judging submission id ${data.submissionId} on problem id ${data.problemId} in ${data.language} language...`,
      LOG_CONTEXT,
    );
  }

  @OnQueueProgress()
  onProgress(job: Job<JudgeJob>, progress: number) {
    const { data } = job;
    Logger.log(
      `Job for submission id ${data.submissionId} progress: ${progress}`,
      LOG_CONTEXT,
    );
    this.judgeGateway.reportStatus(data.submissionId, progress, 'JUDGING');
    return;
  }

  @OnQueueCompleted()
  onCompleted(job: Job<JudgeJob>, result: JudgeResult) {
    const { data } = job;
    Logger.log(
      `Judging on submission id ${
        data.submissionId
      } has been completed with result ${JSON.stringify(result)}.`,
      LOG_CONTEXT,
    );
    this.judgeGateway.reportStatus(data.submissionId, 100, result.status);
  }
}
