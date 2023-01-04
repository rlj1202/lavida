import { PaginationOptionsDTO } from './pagination-options.dto';

export class PaginationResponseDTO<T> {
  constructor(items: T[], total: number, options: PaginationOptionsDTO) {
    this.items = items;
    this.total = total;

    this.offset = options.offset;
    this.limit = options.limit;
  }

  readonly items: T[];
  readonly total: number;

  readonly offset: number;
  readonly limit: number;
}
