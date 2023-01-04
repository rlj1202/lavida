import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':username')
  async findUserByUsername(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);

    return user;
  }
}
