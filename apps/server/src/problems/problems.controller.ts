import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';

import { ListProblemsOptionsDTO } from './dto/list-problems-options.dto';
import { SearchProblemsDTO } from './dto/search-problems.dto';
import { ProblemsService } from './problems.service';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Get('search')
  async search(@Query() options: SearchProblemsDTO) {
    const paginatedResult = await this.problemsService.search(options);
    return paginatedResult;
  }

  @Get()
  async findAll(@Query() options: ListProblemsOptionsDTO) {
    const problems = await this.problemsService.paginate(options);
    return problems;
  }

  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const problem = await this.problemsService.findById(id);
    return problem;
  }
}
