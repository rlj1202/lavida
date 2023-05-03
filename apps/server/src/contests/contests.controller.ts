import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { GetUser } from 'src/auth/user.decorator';
import {
  UseAuthPolicies,
  UsePolicies,
} from 'src/decorators/use-policies.decorator';

import { User } from 'src/users/entities/user.entity';
import { Contest } from './entities/contest.entity';
import { ContestProblem } from './entities/contest-problem.entity';

import { ContestsService } from './contests.service';

import {
  CreateContestHandler,
  DeleteContestHandler,
  UpdateContestHandler,
} from './contests.handler';

import { CreateContestDto } from './dto/create-contest.dto';
import { UpdateContestDto } from './dto/update.contest.dto';
import { ListContestsOptionsDto } from './dto/list-contests-options.dto';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { AddProblemsDto } from './dto/add-problems.dto';

@ApiTags('contests')
@Controller('contests')
export class ContestsController {
  constructor(private readonly contestsService: ContestsService) {}

  @ApiBody({ type: ListContestsOptionsDto })
  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginationResponseDto) },
        {
          properties: {
            items: { type: 'array', items: { $ref: getSchemaPath(Contest) } },
          },
        },
      ],
    },
  })
  @Get()
  @UsePolicies([async (ability) => ability.can('read', 'Contest'), []])
  async findAll(@Body() options: ListContestsOptionsDto) {
    const paginatedResult = await this.contestsService.paginate(options);

    return paginatedResult;
  }

  @ApiOkResponse({ type: Contest })
  @Get(':id')
  @UsePolicies([async (ability) => ability.can('read', 'Contest'), []])
  async findById(@Param('id') id: number) {
    const contest = await this.contestsService.findById(id);

    return contest;
  }

  @ApiBody({ type: CreateContestDto })
  @ApiOkResponse({ type: Contest })
  @Post()
  @UseAuthPolicies(CreateContestHandler)
  async create(
    @Body() createContestDto: CreateContestDto,
    @GetUser() user: User,
  ) {
    const contest = await this.contestsService.create(user, createContestDto);

    return contest;
  }

  @ApiBody({ type: UpdateContestDto })
  @Patch(':id')
  @UseAuthPolicies(UpdateContestHandler)
  async update(
    @Param('id') id: number,
    @Body() updateContestDto: UpdateContestDto,
  ) {
    await this.contestsService.update(id, updateContestDto);
  }

  @Delete(':id')
  @UseAuthPolicies(DeleteContestHandler)
  async delete(@Param('id') id: number) {
    await this.contestsService.delete(id);
  }

  @ApiOkResponse({ type: ContestProblem, isArray: true })
  @Get(':id/problems')
  async getProblems(@Param('id') id: number) {
    const contestProblems = await this.contestsService.getProblems(id);

    return contestProblems;
  }

  @Post(':id/problems')
  @UseAuthPolicies()
  async addProblems(@Param('id') id: number, @Body() options: AddProblemsDto) {
    await this.contestsService.addProblems(id, options.problemIds);
  }

  @Delete(':id/problems/:problemId')
  @UseAuthPolicies([
    async (ability) => ability.can('delete', 'ContestProblem'),
    [],
  ])
  async removeProblem(
    @Param('id') id: number,
    @Param('problemId') problemId: number,
  ) {
    await this.contestsService.removeProblem(id, problemId);
  }

  @Get(':id/admins')
  @UseAuthPolicies([async (ability) => ability.can('read', 'Contest'), []])
  async getAdmins(@Param('id') id: number) {
    // TODO:
    return;
  }

  @Post(':id/admins')
  @UseAuthPolicies([async (ability) => ability.can('update', 'Contest'), []])
  async addAdmins(@Param('id') id: number) {
    // TODO:
    return;
  }

  @Delete(':id/admins/:userId')
  @UseAuthPolicies([async (ability) => ability.can('update', 'Contest'), []])
  async removeAdmin(@Param('id') id: number, @Param('userId') userId: number) {
    // TODO:
    return;
  }
}
