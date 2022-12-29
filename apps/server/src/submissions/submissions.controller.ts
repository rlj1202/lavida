import { Controller, Post } from '@nestjs/common';

import { SubmissionsService } from './submissions.service';

import { SubmitDto } from './dto/submit.dto';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  async submit(submitDto: SubmitDto) {
    const submission = await this.submissionsService.submit(submitDto);

    return submission;
  }
}
