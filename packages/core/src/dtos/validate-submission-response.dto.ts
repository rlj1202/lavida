import { Type } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';

import { SubmissionStatus } from '../entities/submission.entity';

export class ValidateSubmissionResponseDto {
  @IsEnum(SubmissionStatus)
  status: SubmissionStatus;

  @IsNumber()
  @Type(() => Number)
  time: number;

  @IsNumber()
  @Type(() => Number)
  memory: number;
}
