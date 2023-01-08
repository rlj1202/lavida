import { Controller, Get, Param } from '@nestjs/common';
import { UserProblemsService } from './user-problems.service';

@Controller('user-problems')
export class UserProblemsController {
  constructor(private readonly userProblemsService: UserProblemsService) {}

  @Get(':userId')
  async findAllByUserId(@Param() userId: number) {
    const userProblems = await this.userProblemsService.findByUserId(userId);

    return userProblems;
  }
}
