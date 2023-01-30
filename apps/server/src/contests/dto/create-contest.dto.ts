import { IsString } from 'class-validator';

export class CreateContestDto {
  @IsString()
  title: string;

  @IsString()
  descrption: string;
}
