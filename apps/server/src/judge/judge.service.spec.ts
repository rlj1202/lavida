import { Test } from '@nestjs/testing';

import { ConfigModule } from '@nestjs/config';
import { JudgeModule } from './judge.module';

import { JudgeService } from './judge.service';
import { SubmissionStatus } from '@lavida/core/entities/submission.entity';

describe.skip('JudgeService', () => {
  let judgeService: JudgeService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [JudgeModule, ConfigModule],
      providers: [JudgeService],
    }).compile();

    judgeService = moduleRef.get<JudgeService>(JudgeService);
  });

  it.skip('should be accepted', async () => {
    // TODO: mock dependencies

    const reportProgress = async (_value: any) => {
      return;
    };
    const result = await judgeService.judge(1000, reportProgress);

    expect(result.status).toEqual(SubmissionStatus.ACCEPTED);
  });

  it.skip('should be wrong answer', async () => {
    // TODO:
  });
});
