import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  const port = configService.get<number>('PORT', 3002);

  await app.listen(port);

  Logger.log('🚀 Judge server is up and running.');
  Logger.log(`Listening at port ${port}.`);
}
bootstrap();
