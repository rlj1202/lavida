import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { KafkaOptions, MicroserviceOptions } from '@nestjs/microservices';
import { KAFKA_CLIENT_OPTIONS_TOKEN } from './app.constant';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options: KafkaOptions = app.get(KAFKA_CLIENT_OPTIONS_TOKEN);

  app.connectMicroservice<MicroserviceOptions>(options);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.init();
  await app.startAllMicroservices();

  Logger.log('🚀 Judgeworker updater is up and running.');
}
bootstrap();
