import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';

export class CreateContestDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  startAt: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  endAt: Date;

  @ApiProperty({ type: 'number', isArray: true })
  @IsArray()
  @IsNumber({}, { each: true })
  problemIds: number[];
}
