import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProblemsModule } from '@lavida/server/problems/problems.module';
import { UserProblemsModule } from '@lavida/server/userProblems/user-problems.module';
import { UsersModule } from '@lavida/server/users/users.module';
import { SubmissionsModule } from '@lavida/server/submissions/submissions.module';
import { JudgerModule } from '@lavida/judger';

import { JudgeService } from './judge.service';
import { JudgeProcessor } from './judge.processor';
import { JudgeGateway } from './judge.gateway';

@Module({
  imports: [
    ConfigModule,
    ProblemsModule,
    UsersModule,
    UserProblemsModule,
    SubmissionsModule,
    JudgerModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const socketPath = configService.get<string>('docker.socketPath');

        const host = configService.get<string>('docker.host');
        const port = configService.get<number>('docker.port');

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
  providers: [JudgeService, JudgeProcessor, JudgeGateway],
  exports: [JudgeService],
})
export class JudgeModule {}
