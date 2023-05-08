import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProblemsModule } from '@lavida/server/userProblems/user-problems.module';
import { CaslModule } from '@lavida/server/casl/casl.module';

import { User } from '@lavida/core/entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { Submission } from '@lavida/core/entities/submission.entity';
import { Problem } from '@lavida/core/entities/problem.entity';

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
