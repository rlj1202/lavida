import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';

import { UserProblemsService } from './user-problems.service';

import { UserProblem } from './user-problem.entity';

@ApiTags('user-problems')
@Controller('user-problems')
export class UserProblemsController {
  constructor(private readonly userProblemsService: UserProblemsService) {}

  @ApiOkResponse({
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(UserProblem) },
    },
  })
  @Get(':userId')
  async findAllByUserId(@Param('userId') userId: number) {
    const userProblems = await this.userProblemsService.findByUserId(userId);

    return userProblems;
  }
}
