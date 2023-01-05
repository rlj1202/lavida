export interface PaginationResponse<T> {
  items: T[];
  offset?: number;
  limit?: number;
  total?: number;
}
