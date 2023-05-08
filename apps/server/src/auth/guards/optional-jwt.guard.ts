import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { User } from '@lavida/core/entities/user.entity';

import { STRATEGY_NAME } from '../strategies/jwt.strategy';

@Injectable()
export class OptionalJwtGuard extends AuthGuard(STRATEGY_NAME) {
  handleRequest<TUser = User>(
    _err: any,
    user: TUser,
    _info: any,
    _context: ExecutionContext,
    _status?: any,
  ): TUser {
    return user;
  }
}
