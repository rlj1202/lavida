import { IsNumber } from 'class-validator';
import { JudgeRequestDto } from './judge-request.dto';

export class ValidateSubmissionRequestDto extends JudgeRequestDto {
  @IsNumber()
  submissionId: number;
}
