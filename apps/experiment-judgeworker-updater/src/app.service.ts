import { Injectable } from '@nestjs/common';
import { IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

import { StatsService } from '@lavida/core/stats/stats.service';
import { SubmissionStatus } from '@lavida/core/entities/submission.entity';

export class UpdateSubmissionDto {
  @IsNumber()
  @Type(() => Number)
  submissionId: number;

  @IsEnum(SubmissionStatus)
  status: SubmissionStatus;

  @IsNumber()
  @Type(() => Number)
  time: number;

  @IsNumber()
  @Type(() => Number)
  memory: number;
}

@Injectable()
export class AppService {
  constructor(private readonly statsService: StatsService) {}

  async update(dto: UpdateSubmissionDto): Promise<void> {
    await this.statsService.updateSubmissionStatus(
      dto.submissionId,
      dto.status,
      dto.time,
      dto.memory,
    );
  }
}
