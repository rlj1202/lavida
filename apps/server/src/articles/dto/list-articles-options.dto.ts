import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationOptionsDto } from 'src/pagination/pagination-options.dto';

export class ListArticlesOptionsDto extends PaginationOptionsDto {
  @ApiPropertyOptional()
  boardName?: string;
}
