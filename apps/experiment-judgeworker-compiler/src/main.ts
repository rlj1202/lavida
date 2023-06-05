import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);

  const brokers = configService.get<string>('KAFKA_CLIENT_BROKERS').split(',');

  Logger.verbose(`Brokers: ${brokers.join(', ')}`);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'judgeworker-compiler',
        brokers: [...brokers],
      },
      consumer: {
        groupId: 'judgeworker-compiler',
        rebalanceTimeout: 100,
        maxBytes: 1024 * 1024 * 5,
      },
      producer: {
        createPartitioner: Partitioners.DefaultPartitioner,
      },
    },
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.init();
  await app.startAllMicroservices();

  Logger.log('🚀 Judgeworker compiler is up and running.');
}
bootstrap();