import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';
import { Partitioners } from 'kafkajs';

import { StatsModule } from '@lavida/core/stats/stats.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { KAFKA_CLIENT_TOKEN } from './app.constant';

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
      provide: KAFKA_CLIENT_TOKEN,
      useFactory: async (configService: ConfigService) => {
        const brokers = configService
          .get<string>('KAFKA_CLIENT_BROKERS')
          .split(',');

        return ClientProxyFactory.create({
          transport: Transport.KAFKA,
          options: {
            client: {
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
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
