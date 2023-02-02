import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import judgeConfig from './config/judge.config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { ProblemsModule } from './problems/problems.module';
import { JudgeModule } from './judge/judge.module';
import { BullModule } from '@nestjs/bull';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UserProblemsModule } from './userProblems/user-problems.module';
import { WorkbooksModule } from './workbooks/workbooks.module';
import { ContestsModule } from './contests/contests.module';
import { BoardsModule } from './boards/boards.module';
import { ArticlesModule } from './articles/articles.module';
import { CommentsModule } from './comments/comments.module';
import { RolesModule } from './roles/roles.module';

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
});

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'mysql',
        host: ConfigService.get<string>('database.host'),
        port: ConfigService.get<number>('database.port'),
        username: ConfigService.get<string>('database.username'),
        password: ConfigService.get<string>('database.password'),
        database: ConfigService.get<string>('database.name'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local'],
      load: [appConfig, databaseConfig, jwtConfig, judgeConfig],
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
