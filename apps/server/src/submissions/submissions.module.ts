import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CaslModule } from 'src/casl/casl.module';

import { ProblemsModule } from 'src/problems/problems.module';
import { UsersModule } from 'src/users/users.module';

import { Submission } from './entities/submission.entity';
import { SubmissionsController } from './submissions.controller';
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
  providers: [SubmissionsService],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
