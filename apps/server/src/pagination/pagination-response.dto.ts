import { ApiProperty } from '@nestjs/swagger';
import { PaginationOptionsDTO } from './pagination-options.dto';

export class PaginationResponseDTO<T> {
  constructor(items: T[], total: number, options: PaginationOptionsDTO) {
    this.items = items;
    this.total = total;

    this.offset = options.offset;
    this.limit = options.limit;
  }

  readonly items: T[];

  @ApiProperty()
  readonly total: number;

  @ApiProperty()
  readonly offset: number;

  @ApiProperty()
  readonly limit: number;
}
