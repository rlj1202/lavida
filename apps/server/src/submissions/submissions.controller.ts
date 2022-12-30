import { Controller, Post, UseGuards } from '@nestjs/common';

import { SubmissionsService } from './submissions.service';

import { SubmitDto } from './dto/submit.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PoliciesGuard } from 'src/guards/policies.guard';
import { CheckPolicies } from 'src/decorators/check-policies.decorator';
import { Action } from 'src/casl/casl-factory.factory';
import { Submission } from './entities/submission.entity';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Create, Submission))
  async submit(submitDto: SubmitDto) {
    const submission = await this.submissionsService.submit(submitDto);

    return submission;
  }
}
