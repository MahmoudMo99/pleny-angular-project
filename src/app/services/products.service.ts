import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IApiPaginateResponse } from '../models/iapi-paginate-response';
import { IProducts } from '../models/iproducts';
import { environment } from 'src/environments/environment';
import { IProductsQuery } from 'src/app/models/iproducts-query';
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  // method to get all categories list
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(environment.categoriesUrl);
  }
  // method to get products in all cases ( all prodcts, filterd products based on category or search )
  getProducts(
    params: IProductsQuery
  ): Observable<IApiPaginateResponse<IProducts>> {
    let httpParams = new HttpParams()
      .set('limit', params.limit.toString())
      .set('skip', params.skip.toString());

    // if a search query is provided, use the search URL
    if (params.query) {
      httpParams = httpParams.set('q', params.query);
      return this.http.get<IApiPaginateResponse<IProducts>>(
        `${environment.searchProductsUrl}`,
        { params: httpParams }
      );
      // if a category is selected (and it is not 'All'), fetch products based on category
    } else if (params.category && params.category !== 'All') {
      httpParams = httpParams.set('category', params.category);
      return this.http.get<IApiPaginateResponse<IProducts>>(
        `${environment.categoryProductsUrl}${params.category}`,
        { params: httpParams }
      );
      // if no search query or specific category, fetch all products
    } else {
      return this.http.get<IApiPaginateResponse<IProducts>>(
        `${environment.productsUrl}`,
        { params: httpParams }
      );
    }
  }

  getAllProductsCount(): Observable<IApiPaginateResponse<IProducts>> {
    return this.http.get<IApiPaginateResponse<IProducts>>(
      environment.productsUrl
    );
  }

  getProductCountByCategory(category: string): Observable<number> {
    return this.http
      .get<IApiPaginateResponse<IProducts>>(
        `${environment.categoryProductsUrl}${category}`
      )
      .pipe(map((response) => response.total));
  }
}
