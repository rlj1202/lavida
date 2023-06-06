import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientProxyFactory,
  KafkaOptions,
  Transport,
} from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';
import { Partitioners } from 'kafkajs';

import { StatsModule } from '@lavida/core/stats/stats.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { KAFKA_CLIENT_OPTIONS_TOKEN, KAFKA_CLIENT_TOKEN } from './app.constant';

const validationSchema = Joi.object({
  KAFKA_CLIENT_BROKERS: Joi.string().required(),
});

@Module({
  imports: [
    ConfigModule.forRoot({ validationSchema }),
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
          synchronize: false,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    StatsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: KAFKA_CLIENT_OPTIONS_TOKEN,
      useFactory: async (configService: ConfigService) => {
        const clientId = configService.get<string>(
          'KAFKA_CLIENT_ID',
          'judgeworker-updater',
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
              groupId: 'judgeworker-updater',
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
