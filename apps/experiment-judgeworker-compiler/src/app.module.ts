import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import Joi from 'joi';
import { Partitioners } from 'kafkajs';

import { DockerModule } from '@lavida/docker';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { KAFKA_CLIENT_TOKEN } from './app.constant';

const validationSchema = Joi.object({
  KAFKA_CLIENT_BROKERS: Joi.string().required(),
});

@Module({
  imports: [
    ConfigModule.forRoot({ validationSchema }),
    DockerModule.registerAsync({
      useFactory: () => {
        return {};
      },
    }),
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
              groupId: 'judgeworker-compiler',
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
