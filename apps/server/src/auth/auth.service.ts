import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import ms = require('ms');

import { User } from 'src/users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';

import { UsersService } from 'src/users/users.service';

import { RegisterDto } from './dto/register.dto';

import { JwtPayload } from './jwt-payload.interface';

import { AppConfigType } from 'src/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AppConfigType, true>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokensRepository: Repository<RefreshToken>,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);

    const doesMatch = await bcrypt.compare(password, user.passwordHash);
    if (!doesMatch) {
      throw new HttpException(
        'User password does not match.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const user = await this.usersService.create({
      ...registerDto,
    });

    return user;
  }

  async generateAccessToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.accessTokenSecret'),
      expiresIn: this.configService.get<string>('jwt.accessTokenExpireTime'),
    });

    return accessToken;
  }

  async generateRefreshToken(): Promise<string> {
    const token = uuid.v4();

    return token;
  }

  async validateRefreshToken(token: string): Promise<RefreshToken> {
    const refreshToken = await this.refreshTokensRepository.findOneOrFail({
      where: {
        token,
      },
      relations: {
        user: true,
      },
    });

    return refreshToken;
  }

  async setRefreshToken(userId: number, token: string | null) {
    // TODO:
    // const secret = this.configService.get<string>('jwt.refreshTokenSecret');
    const expiresIn = this.configService.get<string>(
      'jwt.refreshTokenExpireTime',
    );

    const iat = new Date(Date.now() + ms(expiresIn));

    await this.refreshTokensRepository.save({
      userId,
      token,
      expiresAt: iat,
    });
  }
}
