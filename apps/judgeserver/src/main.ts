import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { KafkaOptions, MicroserviceOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';

import { KAFKA_CLIENT_OPTIONS_TOKEN } from './app.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const clientOptions: KafkaOptions = app.get(KAFKA_CLIENT_OPTIONS_TOKEN);

  app.connectMicroservice<MicroserviceOptions>(clientOptions);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.init();
  await app.startAllMicroservices();

  Logger.log('🚀 Judge server is up and running.');
}
bootstrap();
