import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IApiPaginateResponse } from '../models/iapi-paginate-response';
import { IProducts } from '../models/iproducts';
import { environment } from 'src/environments/environment';
import { IProductsQuery } from 'src/app/models/iproducts-query';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  // Method to get the list of all product categories
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(environment.categoriesUrl);
  }

  // Method to get products based on various scenarios:
  // - All products
  // - Filtered products based on category
  // - Filtered products based on search query
  getProducts(
    params: IProductsQuery
  ): Observable<IApiPaginateResponse<IProducts>> {
    let httpParams = new HttpParams()
      .set('limit', params.limit.toString())
      .set('skip', params.skip.toString());

    // If a search query is provided, use the search URL
    if (params.query) {
      httpParams = httpParams.set('q', params.query);
      return this.http.get<IApiPaginateResponse<IProducts>>(
        `${environment.searchProductsUrl}`,
        { params: httpParams }
      );
    }
    // If a category is selected (and it is not 'All'), fetch products based on category
    else if (params.category && params.category !== 'All') {
      httpParams = httpParams.set('category', params.category);
      return this.http.get<IApiPaginateResponse<IProducts>>(
        `${environment.categoryProductsUrl}${params.category}`,
        { params: httpParams }
      );
    }
    // If no search query or specific category, fetch all products
    else {
      return this.http.get<IApiPaginateResponse<IProducts>>(
        `${environment.productsUrl}`,
        { params: httpParams }
      );
    }
  }

  // Method to get the total count of all products
  getAllProductsCount(): Observable<IApiPaginateResponse<IProducts>> {
    return this.http.get<IApiPaginateResponse<IProducts>>(
      environment.productsUrl
    );
  }

  // Method to get the count of products for a specific category
  getProductCountByCategory(category: string): Observable<number> {
    return this.http
      .get<IApiPaginateResponse<IProducts>>(
        `${environment.categoryProductsUrl}${category}`
      )
      .pipe(map((response) => response.total));
  }
}
