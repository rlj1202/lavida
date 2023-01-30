import { IsString } from 'class-validator';

export class UpdateWorkbookDto {
  @IsString()
  title: string;
}
