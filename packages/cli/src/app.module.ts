import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { BasicCommand } from './commands/basic.command';
import { JudgeCommand } from './commands/judge.command';
import { ExperimentCommand } from './commands/experiment.command';

import { Problem } from '@lavida/core/entities/problem.entity';
import { User } from '@lavida/core/entities/user.entity';
import { Submission } from '@lavida/core/entities/submission.entity';
import { UserProblem } from '@lavida/core/entities/user-problem.entity';
import { Role } from '@lavida/core/entities/role.entity';

import { KAFKA_CLIENT_TOKEN } from './app.constants';
import { Partitioners } from 'kafkajs';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          database: configService.get<string>('DATABASE_NAME'),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          entities: [Problem, User, Submission, UserProblem, Role],
          autoLoadEntities: false,
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Problem]),
  ],
  providers: [
    BasicCommand,
    JudgeCommand,
    ExperimentCommand,
    {
      provide: KAFKA_CLIENT_TOKEN,
      useFactory: (configService: ConfigService) => {
        const brokers = configService
          .get<string>('KAFKA_CLIENT_BROKERS')
          .split(',');

        return ClientProxyFactory.create({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'lavida-cli',
              brokers: [...brokers],
            },
            consumer: {
              groupId: 'lavida-cli',
              rebalanceTimeout: 100,
            },
            producer: {
              createPartitioner: Partitioners.DefaultPartitioner,
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
