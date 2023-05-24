import { IsBoolean, IsNumber } from 'class-validator';

export class JudgeResponseDto {
  @IsBoolean()
  accepted: boolean;

  @IsNumber()
  time: number;

  @IsNumber()
  memory: number;
}
