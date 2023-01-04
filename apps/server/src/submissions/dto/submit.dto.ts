import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class SubmitDto {
  @IsNotEmpty()
  @IsInt()
  @Transform(() => Number)
  problemId: number;

  @IsNotEmpty()
  @IsString()
  language: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
