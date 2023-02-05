import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { SubmissionsService } from './submissions.service';

import { SubmitDto } from './dto/submit.dto';
import { ListSubmissionsOptionsDTO } from './dto/list-submissions-options.dto';
import { PaginationResponseDto } from 'src/pagination/pagination-response.dto';

import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { CheckPolicies } from 'src/casl/check-policies.decorator';

import { GetUser } from 'src/auth/user.decorator';

import { User } from 'src/users/entities/user.entity';
import { Submission } from './entities/submission.entity';

import { CreateSubmissionHandler } from './submissions.handler';

@ApiTags('submissions')
@ApiExtraModels(PaginationResponseDto)
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @ApiOkResponse({
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginationResponseDto) },
        {
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(Submission) },
            },
          },
        },
      ],
    },
  })
  @Get()
  async findAll(@Query() options: ListSubmissionsOptionsDTO) {
    const submissions = await this.submissionsService.paginate(options);

    return submissions;
  }

  @ApiBearerAuth()
  @ApiBody({ type: SubmitDto })
  @ApiOkResponse({ type: Submission })
  @Post()
  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies(CreateSubmissionHandler)
  async submit(@Body() submitDto: SubmitDto, @GetUser() user: User) {
    const submission = await this.submissionsService.submit(user.id, submitDto);

    return submission;
  }
}
