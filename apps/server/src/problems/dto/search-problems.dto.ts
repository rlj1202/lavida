import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { PaginationOptionsDto } from 'src/pagination/pagination-options.dto';

export class SearchProblemsDTO extends PaginationOptionsDto {
  @ApiProperty()
  @IsString()
  query: string;
}
