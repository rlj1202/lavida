import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { GetUser } from 'src/auth/user.decorator';

import { User } from 'src/users/entities/user.entity';

import { MailerService } from '@nestjs-modules/mailer';
import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';

import { LocalAuthGuard } from './guards/local.guard';
import { JwtGuard } from './guards/jwt.guard';
import { JwtRefreshGuard } from './guards/refresh-jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @UseGuards(JwtGuard)
  @Get()
  async authenticate(@GetUser() user: User) {
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@GetUser() user: User) {
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken();

    await this.authService.setRefreshToken(user.id, refreshToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  @Post('logout')
  @UseGuards(JwtGuard)
  async logout(@GetUser() user: User) {
    await this.authService.setRefreshToken(user.id, null);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);

    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken();

    await this.authService.setRefreshToken(user.id, refreshToken);

    try {
      this.mailerService.sendMail({
        to: user.email,
        // Set by default values of MailerModule
        // from: '',
        subject: 'Lavida 가입을 환영합니다',
        template: 'registerGreeting',
        context: {
          user: {
            username: user.username,
          },
        },
      });
    } catch (err) {
      if (err instanceof ReferenceError) {
        throw err;
      }

      throw err;
    }

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@GetUser() user: User) {
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken();

    await this.authService.setRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }
}
