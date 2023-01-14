import { IsString } from 'class-validator';
import { PaginationOptionsDTO } from 'src/pagination/pagination-options.dto';

export class SearchProblemsDTO extends PaginationOptionsDTO {
  @IsString()
  query: string;
}
