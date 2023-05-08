import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from '@lavida/server/casl/casl.module';

import { ContestsService } from './contests.service';
import { ContestsController } from './contests.controller';

import {
  CreateContestHandler,
  DeleteContestHandler,
  UpdateContestHandler,
} from './contests.handler';

import { Contest } from '@lavida/core/entities/contest.entity';
import { ContestProblem } from '@lavida/core/entities/contest-problem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contest, ContestProblem]), CaslModule],
  controllers: [ContestsController],
  providers: [
    ContestsService,
    CreateContestHandler,
    UpdateContestHandler,
    DeleteContestHandler,
  ],
  exports: [ContestsService],
})
export class ContestsModule {}
