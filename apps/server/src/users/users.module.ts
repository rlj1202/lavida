import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProblemsModule } from 'src/userProblems/user-problems.module';
import { CaslModule } from 'src/casl/casl.module';

import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { Submission } from 'src/submissions/entities/submission.entity';
import { Problem } from 'src/problems/entities/problem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Problem, Submission]),
    UserProblemsModule,
    CaslModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
