import { Logger, Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProblemsModule } from 'src/problems/problems.module';
import { UserProblemsModule } from 'src/userProblems/user-problems.module';
import { UsersModule } from 'src/users/users.module';
import { SubmissionsModule } from 'src/submissions/submissions.module';
import { DockerModule } from '@lavida/docker';

import { JudgeService } from './judge.service';
import { JudgeProcessor } from './judge.processor';
import { JudgeGateway } from './judge.gateway';
import { Judger } from './judger.service';

@Module({
  imports: [
    ConfigModule,
    ProblemsModule,
    UsersModule,
    UserProblemsModule,
    SubmissionsModule,
    DockerModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const socketPath = configService.get<string>('docker.socketPath');

        const host = configService.get<string>('docker.host');
        const port = configService.get<number>('docker.port');

        const logger = new Logger(JudgeModule.name);

        if (socketPath) {
          logger.verbose(`Connect docker to "${socketPath}"`);
        } else if (host) {
          logger.verbose(`Connect docker to "${host}:${port}"`);
        }

        return {
          socketPath,
          host,
          port,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [JudgeService, JudgeProcessor, JudgeGateway, Judger],
  exports: [JudgeService],
})
export class JudgeModule {}
