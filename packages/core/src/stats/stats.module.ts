import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StatsService } from './stats.service';

import { Problem } from '../entities/problem.entity';
import { Submission } from '../entities/submission.entity';
import { UserProblem } from '../entities/user-problem.entity';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Problem, Submission, UserProblem, Role]),
  ],
  controllers: [],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
