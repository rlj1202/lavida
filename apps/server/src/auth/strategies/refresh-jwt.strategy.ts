import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';

import { User } from 'src/users/entities/user.entity';

import { AuthService } from '../auth.service';

import { IVerifyCallbackWithRequest } from '../verify-callback.interface';

export const STRATEGY_NAME = 'jwt-refresh';

@Injectable()
export class JwtRefreshStrategy
  extends PassportStrategy(Strategy, STRATEGY_NAME)
  implements IVerifyCallbackWithRequest
{
  constructor(private readonly authService: AuthService) {
    super();
  }

  /**
   * @description Validate the refresh token and return the user entity.
   * @returns User entity
   */
  async validate(request: Request): Promise<User> {
    const token: string | undefined =
      request.body['refreshToken'] || request.cookies['refresh_token'];

    if (!token) {
      throw new HttpException(
        'Refresh token must be provided via body or cookies.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const refreshToken = await this.authService.validateRefreshToken(token);

    if (refreshToken.expiresAt < new Date()) {
      throw new HttpException(
        'Refresh token has been expired.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return refreshToken.user;
  }
}
