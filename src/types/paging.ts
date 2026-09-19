export interface PagingMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PagingResponse<T> {
  items: T[];
  meta: PagingMeta;
}
