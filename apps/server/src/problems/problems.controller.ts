import { Controller, Get, Param } from '@nestjs/common';
import { ProblemsService } from './problems.service';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Get()
  async findAll() {
    const problems = await this.problemsService.findAll();

    return problems;
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const problem = await this.problemsService.findById(id);

    return problem;
  }
}
