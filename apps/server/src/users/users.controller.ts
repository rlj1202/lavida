import { Controller, Get, Param } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { UsersService } from './users.service';
import { UserProblemsService } from 'src/userProblems/user-problems.service';

import { UserInfoDTO } from './dto/user-info.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userProblemsService: UserProblemsService,
  ) {}

  @Get(':username')
  async findUserByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    const userProblems = await this.userProblemsService.findByUsername(
      username,
    );

    return plainToClass(UserInfoDTO, {
      ...user,
      problems: userProblems,
    });
  }
}
