import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Problem } from '@lavida/core/entities/problem.entity';
import { ProblemsController } from './problems.controller';
import { ProblemsService } from './problems.service';

import { Submission } from '@lavida/core/entities/submission.entity';
import { UserProblemsModule } from '@lavida/server/userProblems/user-problems.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Problem, Submission]),
    UserProblemsModule,
  ],
  controllers: [ProblemsController],
  providers: [ProblemsService],
  exports: [ProblemsService],
})
export class ProblemsModule {}
