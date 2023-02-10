import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';

export class AddProblemsDto {
  @ApiProperty({ isArray: true, type: 'number' })
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  problemIds: number[];
}
