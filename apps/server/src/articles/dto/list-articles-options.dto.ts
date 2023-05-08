import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationOptionsDto } from '@lavida/server/pagination/pagination-options.dto';

export class ListArticlesOptionsDto extends PaginationOptionsDto {
  @ApiPropertyOptional()
  boardName?: string;
}
