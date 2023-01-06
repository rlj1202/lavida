import { Controller, Get, Param, Query } from '@nestjs/common';
import { ListSubmissionsOptionsDTO } from 'src/submissions/dto/list-submissions-options.dto';
import { ProblemsService } from './problems.service';

@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  @Get()
  async findAll(@Query() options: ListSubmissionsOptionsDTO) {
    const problems = await this.problemsService.paginate(options);
    return problems;
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const problem = await this.problemsService.findById(id);

    return problem;
  }
}
