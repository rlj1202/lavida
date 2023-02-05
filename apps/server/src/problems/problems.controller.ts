import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { Problem } from './entities/problem.entity';

import { ProblemsService } from './problems.service';

import { ListProblemsOptionsDTO } from './dto/list-problems-options.dto';
import { SearchProblemsDTO } from './dto/search-problems.dto';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';

@ApiTags('problems')
@ApiExtraModels(PaginationResponseDto)
@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginationResponseDto) },
        {
          properties: {
            items: { type: 'array', items: { $ref: getSchemaPath(Problem) } },
          },
        },
      ],
    },
  })
  @Get('search')
  async search(@Query() options: SearchProblemsDTO) {
    const paginatedResult = await this.problemsService.search(options);
    return paginatedResult;
  }

  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginationResponseDto) },
        {
          properties: {
            items: { type: 'array', items: { $ref: getSchemaPath(Problem) } },
          },
        },
      ],
    },
  })
  @Get()
  async findAll(@Query() options: ListProblemsOptionsDTO) {
    const problems = await this.problemsService.paginate(options);
    return problems;
  }

  @ApiOkResponse({ type: Problem })
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const problem = await this.problemsService.findById(id);
    return problem;
  }
}
