import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { UserProblemsService } from './user-problems.service';

import { UserProblem } from '@lavida/core/entities/user-problem.entity';

@ApiTags('user-problems')
@Controller('user-problems')
export class UserProblemsController {
  constructor(private readonly userProblemsService: UserProblemsService) {}

  @ApiOkResponse({ type: UserProblem, isArray: true })
  @Get(':userId')
  async findAllByUserId(@Param('userId') userId: number) {
    const userProblems = await this.userProblemsService.findByUserId(userId);

    return userProblems;
  }
}
