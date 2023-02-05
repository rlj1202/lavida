import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { GetUser } from 'src/auth/user.decorator';

import { User } from 'src/users/entities/user.entity';

import { MailerService } from '@nestjs-modules/mailer';
import { AuthService } from './auth.service';

import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { RefreshDto } from './dto/refresh.dto';

import { LocalAuthGuard } from './guards/local.guard';
import { JwtGuard } from './guards/jwt.guard';
import { JwtRefreshGuard } from './guards/refresh-jwt.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get()
  async authenticate(@GetUser() user: User) {
    return user;
  }

  @ApiBasicAuth()
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponseDto })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@GetUser() user: User): Promise<LoginResponseDto> {
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken();

    await this.authService.setRefreshToken(user.id, refreshToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(JwtGuard)
  async logout(@GetUser() user: User) {
    await this.authService.setRefreshToken(user.id, null);
  }

  @ApiOkResponse({ type: RegisterResponseDto })
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<RegisterResponseDto> {
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

  @ApiBody({ type: RefreshDto })
  @ApiOkResponse({ type: RefreshResponseDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Refresh token is not provided.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Refresh token has been expired.',
  })
  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@GetUser() user: User): Promise<RefreshResponseDto> {
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken();

    await this.authService.setRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }
}
