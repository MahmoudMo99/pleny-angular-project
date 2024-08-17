// Defining a generic interface for paginated API responses
export interface IApiPaginateResponse<T> {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  message: string;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  products: T[];
  succeeded: boolean;
  statusCode: number;
  meta: any;
  total: number;
  skip: number;
  limit: number;
  errors: { [key: string]: string[] };
}
