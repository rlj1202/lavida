import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { PaginationOptionsDto } from '@lavida/server/pagination/pagination-options.dto';

export class SearchProblemsDTO extends PaginationOptionsDto {
  @ApiProperty()
  @IsString()
  query: string;
}
