import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserProblem } from '@lavida/core/entities/user-problem.entity';
import { UserProblemsController } from './user-problems.controller';
import { UserProblemsService } from './user-problems.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserProblem])],
  controllers: [UserProblemsController],
  providers: [UserProblemsService],
  exports: [UserProblemsService],
})
export class UserProblemsModule {}
