import { Module } from '@nestjs/common';

import { ProblemsModule } from 'src/problems/problems.module';
import { SubmissionsModule } from 'src/submissions/submissions.module';

import { JudgeService } from './judge.service';

@Module({
  imports: [SubmissionsModule, ProblemsModule],
  controllers: [],
  providers: [JudgeService],
  exports: [JudgeService],
})
export class JudgeModule {}
