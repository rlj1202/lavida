import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { JudgerModule } from '@lavida/judger';

import { Problem } from '@lavida/core/entities/problem.entity';
import { User } from '@lavida/core/entities/user.entity';
import { Submission } from '@lavida/core/entities/submission.entity';
import { UserProblem } from '@lavida/core/entities/user-problem.entity';
import { Role } from '@lavida/core/entities/role.entity';

const validationSchema = Joi.object({
  PORT: Joi.number().default(3002),

  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.number().default(3306),
  DATABASE_NAME: Joi.string().default('lavida'),
  DATABASE_USERNAME: Joi.string().default('root'),
  DATABASE_PASSWORD: Joi.string().required(),
});

@Module({
  imports: [
    ConfigModule.forRoot({ validationSchema }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('DATABASE_HOST');
        const port = configService.get<number>('DATABASE_PORT');
        const name = configService.get<string>('DATABASE_NAME');
        const username = configService.get<string>('DATABASE_USERNAME');
        const password = configService.get<string>('DATABASE_PASSWORD');

        return {
          type: 'mysql',
          host,
          port,
          database: name,
          username,
          password,
          entities: [Problem, User, Submission, UserProblem, Role],
          synchronize: false,
          autoLoadEntities: false,
        };
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Problem, Submission]),
    JudgerModule.registerAsync({
      imports: [],
      useFactory: async () => {
        return {};
      },
      inject: [],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
