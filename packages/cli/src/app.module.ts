import {
  Inject,
  Logger,
  Module,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ClientKafka,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

import { BasicCommand } from './commands/basic.command';
import { JudgeCommand } from './commands/judge.command';
import { ExperimentCommand } from './commands/experiment.command';

import { Problem } from '@lavida/core/entities/problem.entity';
import { User } from '@lavida/core/entities/user.entity';
import { Submission } from '@lavida/core/entities/submission.entity';
import { UserProblem } from '@lavida/core/entities/user-problem.entity';
import { Role } from '@lavida/core/entities/role.entity';

import { Solution } from './commands/experiments/entities/solution.entity';
import { Sourcecode } from './commands/experiments/entities/sourcecode.entity';
import { Problem as OldProblem } from './commands/experiments/entities/Problem.entity';

import { KAFKA_CLIENT_TOKEN } from './app.constants';

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
          autoLoadEntities: true,
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: 'lavida-old',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          name: 'lavida-old',
          type: 'mysql',
          host: configService.get<string>('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          database: 'lavida-old',
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          autoLoadEntities: true,
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Problem, User, Submission, UserProblem, Role]),
    TypeOrmModule.forFeature([Solution, Sourcecode, OldProblem], 'lavida-old'),
  ],
  providers: [
    BasicCommand,
    JudgeCommand,
    ...ExperimentCommand.registerWithSubCommands(),
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
export class AppModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(KAFKA_CLIENT_TOKEN)
    private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.client.connect();

    Logger.verbose('Kafka client connected');
  }

  async onModuleDestroy() {
    await this.client.close();

    Logger.verbose('Kafka client closed');
  }
}
