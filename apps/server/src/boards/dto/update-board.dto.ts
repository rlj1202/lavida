import { IsString } from 'class-validator';

export class UpdateBoardDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
