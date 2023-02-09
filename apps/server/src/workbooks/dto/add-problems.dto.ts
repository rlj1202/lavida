import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class AddProblemsDto {
  @ApiProperty({ type: 'array', items: { type: 'number' } })
  @IsArray()
  problemIds: number[];
}
