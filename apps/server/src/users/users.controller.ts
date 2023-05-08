import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UserProblemsService } from '@lavida/server/userProblems/user-problems.service';

import { UserInfoDto } from './dto/user-info.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userProblemsService: UserProblemsService,
  ) {}

  @ApiOkResponse({ type: UserInfoDto })
  @Get(':username')
  async findUserByUsername(@Param('username') username: string) {
    try {
      const user = await this.usersService.findByUsername(username);
      const userProblems = await this.userProblemsService.findByUsername(
        username,
      );

      return plainToClass(UserInfoDto, {
        ...user,
        problems: userProblems,
      });
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }

      throw err;
    }
  }
}
