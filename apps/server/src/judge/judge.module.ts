import { Module } from '@nestjs/common';

import { ProblemsModule } from 'src/problems/problems.module';
import { SubmissionsModule } from 'src/submissions/submissions.module';

import { JudgeService } from './judge.service';
import { JudgeProcessor } from './judge.processor';
import { JudgeGateway } from './judge.gateway';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [SubmissionsModule, ProblemsModule, ConfigModule],
  controllers: [],
  providers: [JudgeService, JudgeProcessor, JudgeGateway],
  exports: [JudgeService],
})
export class JudgeModule {}
