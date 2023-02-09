import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';
import {
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import {
  UseAuthPolicies,
  UsePolicies,
} from 'src/decorators/use-policies.decorator';

import { GetUser } from 'src/auth/user.decorator';

import { User } from 'src/users/entities/user.entity';
import { Workbook } from './entities/workbook.entity';
import { WorkbookProblem } from './entities/workbook-problem.entity';

import { WorkbooksService } from './workbooks.service';

import {
  CreateWorkbookHandler,
  CreateWorkbookProblemHandler,
  DeleteWorkbookHandler,
  DeleteWorkbookProblemHandler,
  UpdateWorkbookHandler,
} from './workbooks.handler';

import { CreateWorkbookDto } from './dto/create-workbook.dto';
import { UpdateWorkbookDto } from './dto/update-workbook.dto';
import { ListWorkbooksOptionsDto } from './dto/list-workbooks-options.dto';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';
import { AddProblemsDto } from './dto/add-problems.dto';

@ApiExtraModels(PaginationResponseDto, WorkbookProblem)
@ApiTags('workbooks')
@Controller('workbooks')
export class WorkbooksController {
  constructor(private readonly workbooksService: WorkbooksService) {}

  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginationResponseDto) },
        {
          properties: {
            items: { type: 'array', items: { $ref: getSchemaPath(Workbook) } },
          },
        },
      ],
    },
  })
  @Get()
  @UsePolicies([async (ability) => ability.can('read', 'Workbook'), []])
  async findAll(@Query() options: ListWorkbooksOptionsDto) {
    const paginatedResult = await this.workbooksService.paginate(options);

    return paginatedResult;
  }

  @ApiOkResponse({ type: Workbook })
  @Get(':id')
  @UsePolicies([async (ability) => ability.can('read', 'Workbook'), []])
  async findById(@Param('id') id: number) {
    try {
      const workbook = await this.workbooksService.findById(id);

      return workbook;
    } catch (err) {
      if (err instanceof EntityNotFoundError) {
        throw new HttpException('Invalid id', HttpStatus.BAD_REQUEST);
      }

      throw err;
    }
  }

  @ApiBody({ type: CreateWorkbookDto })
  @ApiOkResponse({ type: Workbook })
  @Post()
  @UseAuthPolicies(CreateWorkbookHandler)
  async create(
    @Body() createWorkbookDto: CreateWorkbookDto,
    @GetUser() user: User,
  ): Promise<Workbook> {
    const workbook = await this.workbooksService.create(
      user,
      createWorkbookDto,
    );

    return workbook;
  }

  @ApiBody({ type: UpdateWorkbookDto })
  @Patch(':id')
  @UseAuthPolicies(UpdateWorkbookHandler)
  async update(
    @Param('id') id: number,
    @Body() updateWorkbookDto: UpdateWorkbookDto,
  ) {
    await this.workbooksService.update(id, updateWorkbookDto);
  }

  @Delete(':id')
  @UseAuthPolicies(DeleteWorkbookHandler)
  async delete(@Param('id') id: number) {
    await this.workbooksService.delete(id);
  }

  @ApiOkResponse({
    schema: { type: 'array', items: { $ref: getSchemaPath(WorkbookProblem) } },
  })
  @Get(':id/problems')
  @UsePolicies([async (ability) => ability.can('read', 'WorkbookProblem'), []])
  async getProblems(@Param('id') id: number) {
    const problems = await this.workbooksService.getProblems(id);

    return problems;
  }

  @ApiBody({ type: AddProblemsDto })
  @Post(':id/problems')
  @UseAuthPolicies(CreateWorkbookProblemHandler)
  async addProblems(@Param('id') id: number, @Body() dto: AddProblemsDto) {
    await this.workbooksService.addProblems(id, dto.problemIds);
  }

  @Delete(':id/problems/:problemId')
  @UseAuthPolicies(DeleteWorkbookProblemHandler)
  async removeProblem(
    @Param('id') id: number,
    @Param('problemId') problemId: number,
  ) {
    await this.workbooksService.removeProblem(id, problemId);
  }
}
