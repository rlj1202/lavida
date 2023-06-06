import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ClientProxyFactory,
  KafkaOptions,
  Transport,
} from '@nestjs/microservices';
import Joi from 'joi';
import { Partitioners } from 'kafkajs';

import { Problem } from '@lavida/core/entities/problem.entity';
import { User } from '@lavida/core/entities/user.entity';
import { Submission } from '@lavida/core/entities/submission.entity';
import { UserProblem } from '@lavida/core/entities/user-problem.entity';
import { Role } from '@lavida/core/entities/role.entity';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { KAFKA_CLIENT_OPTIONS_TOKEN, KAFKA_CLIENT_TOKEN } from './app.constant';

const validationSchema = Joi.object({
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.number().default(3306),
  DATABASE_NAME: Joi.string().default('lavida'),
  DATABASE_USERNAME: Joi.string().default('root'),
  DATABASE_PASSWORD: Joi.string().required(),

  KAFKA_CLIENT_BROKERS: Joi.string().required(),
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
          entities: [Problem, User, Submission, UserProblem, Role],
          synchronize: false,
          autoLoadEntities: false,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Problem, Submission]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: KAFKA_CLIENT_OPTIONS_TOKEN,
      useFactory: async (configService: ConfigService) => {
        const clientId = configService.get<string>(
          'KAFKA_CLIENT_ID',
          'judgeworker-initiator',
        );
        const brokers = configService
          .get<string>('KAFKA_CLIENT_BROKERS')
          .split(',');

        Logger.verbose(`Client id: ${clientId}`);
        Logger.verbose(`Brokers: ${brokers.join(', ')}`);

        const options: KafkaOptions = {
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: clientId,
              brokers: [...brokers],
            },
            consumer: {
              groupId: 'judgeworker-initiator',
              rebalanceTimeout: 100,
            },
            producer: {
              createPartitioner: Partitioners.DefaultPartitioner,
            },
          },
        };

        return options;
      },
      inject: [ConfigService],
    },
    {
      provide: KAFKA_CLIENT_TOKEN,
      useFactory: async (options: KafkaOptions) => {
        return ClientProxyFactory.create(options);
      },
      inject: [KAFKA_CLIENT_OPTIONS_TOKEN],
    },
  ],
})
export class AppModule {}
