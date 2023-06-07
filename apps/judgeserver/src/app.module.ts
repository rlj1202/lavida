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
  KafkaOptions,
  Transport,
} from '@nestjs/microservices';
import Joi from 'joi';
import { Partitioners } from 'kafkajs';

import { JudgerModule } from '@lavida/judger';
import { StatsModule } from '@lavida/core/stats';

import { Problem } from '@lavida/core/entities/problem.entity';
import { User } from '@lavida/core/entities/user.entity';
import { Submission } from '@lavida/core/entities/submission.entity';
import { UserProblem } from '@lavida/core/entities/user-problem.entity';
import { Role } from '@lavida/core/entities/role.entity';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { KAFKA_CLIENT_OPTIONS_TOKEN, KAFKA_CLIENT_TOKEN } from './app.constant';

const validationSchema = Joi.object({
  PORT: Joi.number().default(3002),

  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.number().default(3306),
  DATABASE_NAME: Joi.string().default('lavida'),
  DATABASE_USERNAME: Joi.string().default('root'),
  DATABASE_PASSWORD: Joi.string().required(),
});

@Module({
  imports: [
    ConfigModule.forRoot({ validationSchema }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('DATABASE_HOST');
        const port = configService.get<number>('DATABASE_PORT');
        const name = configService.get<string>('DATABASE_NAME');
        const username = configService.get<string>('DATABASE_USERNAME');
        const password = configService.get<string>('DATABASE_PASSWORD');

        return {
          type: 'mysql',
          host,
          port,
          database: name,
          username,
          password,
          synchronize: false,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Problem, User, Submission, UserProblem, Role]),
    StatsModule,
    JudgerModule.registerAsync({
      imports: [],
      useFactory: async () => {
        return {};
      },
      inject: [],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: KAFKA_CLIENT_OPTIONS_TOKEN,
      useFactory: async (
        configService: ConfigService,
      ): Promise<KafkaOptions> => {
        const clientId = configService.get<string>(
          'KAFKA_CLIENT_ID',
          'judgeserver',
        );
        const brokers = configService
          .get<string>('KAFKA_CLIENT_BROKERS', 'localhost:9092')
          .split(',');

        Logger.verbose(`Client id: ${clientId}`);
        Logger.verbose(`Brokers: ${brokers.join(', ')}`);

        return {
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: clientId,
              brokers: [...brokers],
            },
            consumer: {
              groupId: 'judgeserver',
            },
            producer: {
              createPartitioner: Partitioners.DefaultPartitioner,
            },
          },
        };
      },
      inject: [ConfigService],
    },
    {
      provide: KAFKA_CLIENT_TOKEN,
      useFactory: async (options: KafkaOptions): Promise<ClientKafka> => {
        return ClientProxyFactory.create(options) as ClientKafka;
      },
      inject: [KAFKA_CLIENT_OPTIONS_TOKEN],
    },
  ],
  exports: [],
})
export class AppModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject(KAFKA_CLIENT_TOKEN)
    private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.client.connect();

    Logger.verbose('Kafka client has been connected.');
  }

  async onModuleDestroy() {
    await this.client.close();

    Logger.verbose('Kafka client has been closed.');
  }
}
