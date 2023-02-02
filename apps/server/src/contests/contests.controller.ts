import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CheckPolicies } from 'src/casl/check-policies.decorator';
import { GetUser } from 'src/auth/user.decorator';
import { PoliciesGuard } from 'src/casl/policies.guard';

import { User } from 'src/users/entities/user.entity';

import { CreateContestHandler, DeleteContestHandler } from './contests.handler';
import { ContestsService } from './contests.service';
import { CreateContestDto } from './dto/create-contest.dto';

@Controller('contests')
export class ContestsController {
  constructor(private readonly contestsService: ContestsService) {}

  @Get(':id')
  async findById(@Param('id') id: number) {
    const contest = await this.contestsService.findById(id);

    return contest;
  }

  @Post()
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies(CreateContestHandler)
  async create(
    @Body() createContestDto: CreateContestDto,
    @GetUser() user: User,
  ) {
    const contest = await this.contestsService.create(user, createContestDto);

    return contest;
  }

  @Delete(':id')
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies(DeleteContestHandler)
  async delete(@Param('id') id: number) {
    await this.contestsService.delete(id);
  }
}
