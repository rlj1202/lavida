import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contest } from './entities/contest.entity';
import { ContestsService } from './contests.service';
import { ContestsController } from './contests.controller';
import { CreateContestHandler, DeleteContestHandler } from './contests.handler';
import { ContestProblem } from './entities/contest-problem.entity';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [TypeOrmModule.forFeature([Contest, ContestProblem]), CaslModule],
  controllers: [ContestsController],
  providers: [ContestsService, CreateContestHandler, DeleteContestHandler],
  exports: [ContestsService],
})
export class ContestsModule {}
