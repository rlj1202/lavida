import { Logger, Module } from '@nestjs/common';

import Docker = require('dockerode');

import { ConfigModule } from '@nestjs/config';
import { ProblemsModule } from 'src/problems/problems.module';
import { UserProblemsModule } from 'src/userProblems/user-problems.module';
import { UsersModule } from 'src/users/users.module';
import { SubmissionsModule } from 'src/submissions/submissions.module';

import { JudgeService } from './judge.service';
import { JudgeProcessor } from './judge.processor';
import { JudgeGateway } from './judge.gateway';

const LOG_CONTEXT = 'JudgeModule';

@Module({
  imports: [
    ConfigModule,
    ProblemsModule,
    UsersModule,
    UserProblemsModule,
    SubmissionsModule,
  ],
  controllers: [],
  providers: [
    JudgeService,
    JudgeProcessor,
    JudgeGateway,
    {
      provide: Docker,
      useFactory: async (): Promise<Docker> => {
        const docker = new Docker();

        try {
          await docker.ping();

          Logger.log('Docker has been connected.', LOG_CONTEXT);
        } catch (err) {
          Logger.error('Docker is not connected.', LOG_CONTEXT);

          throw err;
        }

        return docker;
      },
    },
  ],
  exports: [JudgeService],
})
export class JudgeModule {}
