import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateWorkbookDto {
  @ApiProperty()
  @IsString()
  title: string;
}
