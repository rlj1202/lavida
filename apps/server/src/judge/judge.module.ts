import { Module } from '@nestjs/common';

import { ProblemsModule } from 'src/problems/problems.module';
import { SubmissionsModule } from 'src/submissions/submissions.module';

import { JudgeService } from './judge.service';
import { JudgeProcessor } from './judge.processor';

@Module({
  imports: [SubmissionsModule, ProblemsModule],
  controllers: [],
  providers: [JudgeService, JudgeProcessor],
  exports: [JudgeService],
})
export class JudgeModule {}
