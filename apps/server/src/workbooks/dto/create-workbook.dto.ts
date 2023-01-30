import { IsString } from 'class-validator';

export class CreateWorkbookDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}
