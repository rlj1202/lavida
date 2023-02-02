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

import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';

import { JwtGuard } from './guards/jwt.guard';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

    return {
      user,
      accessToken,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    const accessToken = await this.authService.generateAccessToken(user);

    return {
      user,
      accessToken,
    };
  }
}
