import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationOptionsDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  readonly offset: number = 0;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(200)
  @IsOptional()
  @Type(() => Number)
  readonly limit: number = 20;
}
