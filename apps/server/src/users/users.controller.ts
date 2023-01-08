import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':username')
  async findUserByUsername(@Param('username') username: string) {
    const userInfo = await this.usersService.fetchUserInfoByUsername(username);
    return userInfo;
  }
}
