import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

import { AppConfigType, configs } from './config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { ProblemsModule } from './problems/problems.module';
import { JudgeModule } from './judge/judge.module';
import { UserProblemsModule } from './userProblems/user-problems.module';
import { WorkbooksModule } from './workbooks/workbooks.module';
import { ContestsModule } from './contests/contests.module';
import { BoardsModule } from './boards/boards.module';
import { ArticlesModule } from './articles/articles.module';
import { CommentsModule } from './comments/comments.module';
import { RolesModule } from './roles/roles.module';

import { LoggerMiddleware } from './middlewares/logger.middleware';

const validationSchema = Joi.object({
  PORT: Joi.number().default(3100),
  PUBLIC_URL: Joi.string().default('http://localhost:3000'),
  PUBLIC_SERVER_URL: Joi.string().default('http://localhost:3100'),

  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().default(3306),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),

  JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
  JWT_ACCESS_TOKEN_EXPIRE_TIME: Joi.string().default('30m'),
  JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
  JWT_REFRESH_TOKEN_EXPIRE_TIME: Joi.string().default('30d'),

  DOCKET_SOCKET_PATH: Joi.string(),
  DOCKER_HOST: Joi.string(),
  DOCKER_PORT: Joi.number().default(2375),
});

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfigType>) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    ConfigModule.forRoot({
      // First one takes precedence
      envFilePath: ['.env', '.env.development', '.env.development.local'],
      load: configs,
      validationSchema,
    }),
    BullModule.forRoot({}),
    AuthModule,
    UsersModule,
    UserProblemsModule,
    ProblemsModule,
    SubmissionsModule,
    JudgeModule,
    ContestsModule,
    WorkbooksModule,
    BoardsModule,
    ArticlesModule,
    CommentsModule,
    RolesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
