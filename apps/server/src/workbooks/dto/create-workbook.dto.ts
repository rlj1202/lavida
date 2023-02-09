import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class CreateWorkbookDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: 'array', items: { type: 'number' } })
  @IsArray()
  @Type(() => Number)
  problemIds: number[];
}
