import { IsNumber, IsOptional, IsString } from 'class-validator';

export class JudgeRequestDto {
  @IsString()
  language: string;

  @IsString()
  code: string;

  @IsNumber()
  problemId: number;

  @IsNumber()
  @IsOptional()
  timeLimit?: number;

  @IsNumber()
  @IsOptional()
  memoryLimit?: number;
}
