import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'src/casl/casl.module';

import { ContestsService } from './contests.service';
import { ContestsController } from './contests.controller';

import { CreateContestHandler, DeleteContestHandler } from './contests.handler';

import { Contest } from './entities/contest.entity';
import { ContestProblem } from './entities/contest-problem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contest, ContestProblem]), CaslModule],
  controllers: [ContestsController],
  providers: [ContestsService, CreateContestHandler, DeleteContestHandler],
  exports: [ContestsService],
})
export class ContestsModule {}
