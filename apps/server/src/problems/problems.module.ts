import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Problem } from './entities/problem.entity';
import { ProblemsController } from './problems.controller';
import { ProblemsService } from './problems.service';

import { Submission } from 'src/submissions/entities/submission.entity';
import { UserProblemsModule } from 'src/userProblems/user-problems.module';

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
