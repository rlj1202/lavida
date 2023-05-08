import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from '@lavida/server/casl/casl.module';

import { ProblemsModule } from '@lavida/server/problems/problems.module';
import { UsersModule } from '@lavida/server/users/users.module';

import { Submission } from '@lavida/core/entities/submission.entity';
import { SubmissionsController } from './submissions.controller';
import { CreateSubmissionHandler } from './submissions.handler';
import { SubmissionsService } from './submissions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission]),
    BullModule.registerQueue({
      name: 'judge',
    }),
    UsersModule,
    ProblemsModule,
    CaslModule,
  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService, CreateSubmissionHandler],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
