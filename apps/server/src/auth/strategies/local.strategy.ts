import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { IStrategyOptions, Strategy, VerifyFunction } from 'passport-local';

import { User } from '@lavida/core/entities/user.entity';
import { AuthService, InvalidUserCredentialsError } from '../auth.service';

import { IVerifyCallback } from '../verify-callback.interface';

export const STRATEGY_NAME = 'local';

@Injectable()
export class LocalStrategy
  extends PassportStrategy(Strategy, STRATEGY_NAME)
  implements IVerifyCallback<VerifyFunction>
{
  constructor(private authService: AuthService) {
    super(<IStrategyOptions>{});
  }

  async validate(username: string, password: string): Promise<User> {
    try {
      const user = await this.authService.validateUser(username, password);

      return user;
    } catch (err) {
      if (err instanceof InvalidUserCredentialsError) {
        throw new HttpException(err.message, HttpStatus.FORBIDDEN);
      }

      throw err;
    }
  }
}
