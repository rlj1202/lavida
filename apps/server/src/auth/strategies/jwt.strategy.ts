import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import {
  ExtractJwt,
  Strategy,
  StrategyOptions,
  VerifyCallback,
} from 'passport-jwt';

import { User } from 'src/users/entities/user.entity';

import { JwtPayload } from '../jwt-payload.interface';

import { IVerifyCallback } from '../verify-callback.interface';

export const STRATEGY_NAME = 'jwt';

@Injectable()
export class JwtStrategy
  extends PassportStrategy(Strategy, STRATEGY_NAME)
  implements IVerifyCallback<VerifyCallback>
{
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    readonly configService: ConfigService,
  ) {
    super(<StrategyOptions>{
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        // Jwt token from cookie
        (req: Request) => {
          const access_token = req.cookies?.['access_token'];
          if (!access_token) {
            return null;
          }
          return access_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessTokenSecret'),
    });
  }

  /**
   * @description Validate the jwt token and return the user entity.
   * @param payload Jwt payload json object
   * @returns User entity
   */
  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersRepository.findOneOrFail({
      where: {
        id: payload.id,
      },
      relations: {
        role: true,
      },
    });

    return user;
  }
}
