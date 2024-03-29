import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import cookieParser = require('cookie-parser');

import { AppModule } from './app.module';
import { RedisIOAdapter as RedisIoAdapter } from './adapters/redis-io.adapter';

import { AppConfigType } from './config';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService<AppConfigType> = app.get(ConfigService);

  const port = configService.get('app.port', 3100);

  const appUrl = configService.get<string>('app.url', 'http://localhost:3000');

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  // Middlewares
  app.enableCors({ origin: [appUrl], credentials: true });
  app.use(cookieParser());

  // Filters
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // Pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Interceptors
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Swagger
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Lavida Backend')
      .setDescription('Lavida Backend API description')
      .setVersion('0.1.0')
      .addBasicAuth()
      .addBearerAuth()
      .addCookieAuth('access_token')
      .build(),
  );
  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  Logger.log('🚀 Server is up and running.');
  Logger.log(`Listening at port ${port}.`);
}
bootstrap();
