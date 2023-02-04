import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { STRATEGY_NAME } from '../strategies/refresh-jwt.strategy';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(STRATEGY_NAME) {}
