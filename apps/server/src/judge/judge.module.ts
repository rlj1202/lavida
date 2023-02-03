import { Logger, Module } from '@nestjs/common';

import Docker = require('dockerode');

import { ConfigModule, ConfigService } from '@nestjs/config';
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
      useFactory: async (configService: ConfigService): Promise<Docker> => {
        const socketPath = configService.get<string>('docker.socketPath');

        const host = configService.get<string>('docker.host');
        const port = configService.get<number>('docker.port');

        if (socketPath) {
          Logger.log(`Connect docker to "${socketPath}"`, LOG_CONTEXT);
        } else if (host) {
          Logger.log(`Connect docker to "${host}:${port}"`, LOG_CONTEXT);
        }

        const docker = new Docker({
          socketPath,

          host,
          port,
        });

        try {
          await docker.ping();

          Logger.log('Docker has been connected.', LOG_CONTEXT);
        } catch (err) {
          Logger.error('Docker is not connected.', LOG_CONTEXT);

          throw err;
        }

        return docker;
      },
      inject: [ConfigService],
    },
  ],
  exports: [JudgeService],
})
export class JudgeModule {}
