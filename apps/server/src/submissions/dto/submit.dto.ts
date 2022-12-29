import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class SubmitDto {
  @IsNotEmpty()
  @IsInt()
  problemId: number;

  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsString()
  language: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
