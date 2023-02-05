import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

import { PaginationOptionsDTO } from 'src/pagination/pagination-options.dto';

export class ListSubmissionsOptionsDTO extends PaginationOptionsDTO {
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
