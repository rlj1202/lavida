import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { SubmissionsService } from './submissions.service';

import { SubmitDto } from './dto/submit.dto';
import { ListSubmissionsOptionsDTO } from './dto/list-submissions-options.dto';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PoliciesGuard } from 'src/guards/policies.guard';
import { CheckPolicies } from 'src/decorators/check-policies.decorator';

import { GetUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateSubmissionHandler } from './submissions.handler';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get()
  async findAll(@Query() options: ListSubmissionsOptionsDTO) {
    const submissions = await this.submissionsService.paginate(options);
    return submissions;
  }

  @Post()
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies(CreateSubmissionHandler)
  async submit(@Body() submitDto: SubmitDto, @GetUser() user: User) {
    const submission = await this.submissionsService.submit(user.id, submitDto);

    return submission;
  }
}
