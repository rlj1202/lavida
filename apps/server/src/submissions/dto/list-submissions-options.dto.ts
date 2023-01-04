import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationOptionsDTO } from 'src/pagination/pagination-options.dto';

export class ListSubmissionsOptionsDTO extends PaginationOptionsDTO {
  constructor() {
    super();
  }

  @IsString()
  @IsOptional()
  readonly username?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  readonly problemId?: number;
}
