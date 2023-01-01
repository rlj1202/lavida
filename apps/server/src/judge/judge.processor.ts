import {
  OnQueueActive,
  OnQueueCompleted,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { JudgeJob } from './judge.job';
import { JudgeResult, JudgeService } from './judge.service';

@Processor('judge')
export class JudgeProcessor {
  constructor(private readonly judgeService: JudgeService) {}

  @Process()
  async judge(job: Job<JudgeJob>): Promise<JudgeResult> {
    const judgeResult = await this.judgeService.judge(job.data.submissionId);

    return judgeResult;
  }

  @OnQueueActive()
  onActive(job: Job<JudgeJob>) {
    const { data } = job;
    Logger.log(
      `Judging submission id ${data.submissionId} on problem id ${data.problemId} in ${data.language} language...`,
    );
  }

  @OnQueueCompleted()
  onCompleted(job: Job<JudgeJob>, result: JudgeResult) {
    const { data } = job;
    Logger.log(
      `Judging on submission id ${
        data.submissionId
      } has been completed with result ${JSON.stringify(result)}.`,
    );
  }
}
