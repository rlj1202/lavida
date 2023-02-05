import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

import { PaginationOptionsDto } from 'src/pagination/pagination-options.dto';

export class ListSubmissionsOptionsDTO extends PaginationOptionsDto {
  constructor() {
    super();
  }

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly username?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readonly problemId?: number;
}
