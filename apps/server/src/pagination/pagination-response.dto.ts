import { ApiProperty } from '@nestjs/swagger';
import { PaginationOptionsDto } from './pagination-options.dto';

export class PaginationResponseDto<T> {
  constructor(items: T[], total: number, options: PaginationOptionsDto) {
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
