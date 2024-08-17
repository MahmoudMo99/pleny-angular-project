// Defining an interface for the query parameters used when fetching products
export interface IProductsQuery {
  limit: number;
  skip: number;
  category?: string;
  query?: string;
}
