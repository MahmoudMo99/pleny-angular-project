import {
  Component,
  DestroyRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IProducts } from 'src/app/models/iproducts';
import { IProductsQuery } from 'src/app/models/iproducts-query';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';
import { SearchService } from 'src/app/services/search.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit, OnChanges {
  @Input() selectedCategory: string | undefined = 'All'; // Input property to receive the selected category
  @Input() searchQuery: string = ''; // Input property to receive the search query
  products: IProducts[] = []; // Array to store the list of products
  totalProducts: number = 0; // Total number of available products
  limit: number = 9; // Number of products to display per page
  skip: number = 0; // Number of products to skip for pagination
  totalPages: number = 0; // Total number of pages
  currentPage: number = 1; // The current page number

  constructor(
    private productsService: ProductsService, // Service for fetching products
    private searchService: SearchService, // Service for managing search functionality
    private cartService: CartService, // Service for managing the shopping cart
    private destroyRef: DestroyRef // Utility for managing subscriptions to avoid memory leaks
  ) {}

  // Lifecycle hook that is called after the component is initialized
  ngOnInit(): void {
    this.getSearchTerm(); // Initialize search term subscription
    this.fetchProducts(); // Fetch products initially
  }

  // Lifecycle hook that is called when any input property changes
  ngOnChanges(changes: SimpleChanges): void {
    // If the selected category or search query changes, refetch the products
    if (changes['selectedCategory'] || changes['searchQuery']) {
      this.fetchProducts();
    }
  }

  // Method to subscribe to the current search term from the SearchService
  getSearchTerm() {
    this.searchService.currentSearchTerm
      .pipe(takeUntilDestroyed(this.destroyRef)) // Automatically unsubscribe when the component is destroyed
      .subscribe((searchTerm) => {
        this.searchQuery = searchTerm; // Update the search query
        this.fetchProducts(); // Refetch products based on the updated search term
      });
  }

  // Method to handle changes in the selected category
  onCategoryChange(): void {
    // If 'All' is selected, set selectedCategory to undefined to fetch all products
    this.selectedCategory =
      this.selectedCategory === 'All' ? undefined : this.selectedCategory;
    this.fetchProducts(); // Refetch products based on the updated category
  }

  // Method to fetch products based on the current query parameters
  fetchProducts(): void {
    const params: IProductsQuery = {
      limit: this.limit,
      skip: this.skip,
      category: this.selectedCategory, // This will be undefined if "All" is selected
      query: this.searchQuery, // Search query string
    };

    this.productsService
      .getProducts(params) // Fetch products using the ProductsService
      .pipe(takeUntilDestroyed(this.destroyRef)) // Automatically unsubscribe when the component is destroyed
      .subscribe(
        (data) => {
          this.products = data.products; // Store the fetched products
          this.totalProducts = data.total; // Update the total number of products
          this.totalPages = Math.ceil(this.totalProducts / this.limit); // Calculate the total number of pages
        },
        (error) => console.error('Error fetching products:', error) // Log any errors that occur during fetching
      );
  }

  // Method to add a product to the cart by its ID
  addToCart(productId: number): void {
    this.cartService.addToCart(productId); // Use CartService to add the product to the cart
  }

  // Method to remove a product from the cart by its ID
  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId); // Use CartService to remove the product from the cart
  }

  // Method to check if a product is in the cart by its ID
  isInCart(productId: number): boolean {
    return this.cartService.isInCart(productId); // Use CartService to check if the product is in the cart
  }

  // Method to handle pagination page changes
  onPageChange(page: number): void {
    if (page < 1 || page > this.totalPages) return; // Prevent navigating to invalid pages
    this.currentPage = page; // Update the current page number
    this.skip = (page - 1) * this.limit; // Calculate the number of products to skip for the new page
    this.fetchProducts(); // Refetch products for the new page
  }

  // Method to generate an array of pagination pages to display
  getPaginationPages(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5; // Maximum number of pagination pages to display at once
    let startPage = Math.max(
      1,
      this.currentPage - Math.floor(maxPagesToShow / 2)
    ); // Calculate the start page for pagination
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1); // Calculate the end page for pagination

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1); // Adjust start page if necessary
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i); // Add each page number to the pages array
    }

    return pages; // Return the array of pages for pagination
  }

  // Method to calculate the actual price after applying the discount
  calculateActualPrice(price: number, discountPercentage: number): number {
    return price - price * (discountPercentage / 100); // Calculate and return the discounted price
  }
}
