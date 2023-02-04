import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import path = require('path');
import * as Joi from 'joi';

import { AppConfigType, configs } from './config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
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

import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

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

  /** For example, `example@gmail.com`. */
  EMAIL_AUTH_EMAIL: Joi.string().required(),
  EMAIL_AUTH_PASSWORD: Joi.string().required(),
  /** For example, `smtp.gmail.com`. */
  EMAIL_HOST: Joi.string().required(),
  EMAIL_FROM_USER_NAME: Joi.string().required(),
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
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfigType>) => {
        const email = configService.get('mailer.email');
        const password = configService.get('mailer.password');
        const host = configService.get('mailer.host');
        const from = configService.get('mailer.fromUsername');

        const options = {
          transport: `smtps://${email}:${password}@${host}`,
          defaults: {
            from: `"${from}" <${email}>`,
            context: {},
          },
          preview: false,
          template: {
            dir: path.join(process.cwd(), '/templates'),
            adapter: new EjsAdapter(),
            options: {
              strict: true,
            },
          },
        };

        const logger = new Logger(MailerModule.name);

        logger.verbose(`Transport URL: ${options.transport}`);
        logger.verbose(`From username: ${options.defaults.from}`);
        logger.verbose(`Template dir: ${options.template.dir}`);

        return options;
      },
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
