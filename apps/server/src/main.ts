import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import cookieParser = require('cookie-parser');

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('app.port', 3000);

  // Middlewares
  app.use(cookieParser());

  // Pipes
  app.useGlobalPipes(new ValidationPipe());

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

  Logger.log('Server is up and running.');
}
bootstrap();
