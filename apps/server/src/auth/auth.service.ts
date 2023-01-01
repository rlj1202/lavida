import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import { RegisterDto } from './dto/register.dto';

import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.accessTokenSecret'),
      expiresIn: this.configService.get<string>('jwt.accessTokenExpireTime'),
    });

    return accessToken;
  }
}
