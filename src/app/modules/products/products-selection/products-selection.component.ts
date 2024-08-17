import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  DestroyRef,
} from '@angular/core';
import { forkJoin } from 'rxjs'; // Import forkJoin for handling multiple observable requests
import { ProductsService } from 'src/app/services/products.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-products-selection',
  templateUrl: './products-selection.component.html',
  styleUrls: ['./products-selection.component.css'],
})
export class ProductsSelectionComponent implements OnInit {
  categories: string[] = []; // Array to store the list of categories
  selectedCategory: string = 'All'; // Currently selected category
  breadcrumb: string[] = []; // Array to store breadcrumb navigation items
  totalProductsCount: number = 0; // Total number of products across all categories
  categoryProductsCount: { [key: string]: number } = {}; // Object to store the count of products per category

  @Output() categoryChange = new EventEmitter<string>(); // Event emitter to notify parent components of category changes

  constructor(
    private productsService: ProductsService, // Service for fetching product data
    private destroyRef: DestroyRef // Utility for managing subscriptions to avoid memory leaks
  ) {}

  // Lifecycle hook that is called after the component is initialized
  ngOnInit(): void {
    this.fetchCategories(); // Fetch the list of categories when the component is initialized
    this.updateBreadcrumb(); // Initialize breadcrumb navigation
    this.fetchAllProductsCount(); // Fetch the total count of products
  }

  // Method to fetch categories from the ProductsService
  fetchCategories(): void {
    this.productsService
      .getCategories() // Call service method to get categories
      .pipe(takeUntilDestroyed(this.destroyRef)) // Automatically unsubscribe when the component is destroyed
      .subscribe((categories) => {
        this.categories = categories; // Store the fetched categories
        this.fetchcategoryProductsCount(); // Fetch the count of products for each category
      });
  }

  // Method to fetch the count of products for each category
  fetchcategoryProductsCount(): void {
    // Create an array of observables for each category's products count request
    const requests = this.categories.map((category) =>
      this.productsService.getProductCountByCategory(category)
    );
    forkJoin(requests) // Execute all observables in parallel and wait for all to complete
      .pipe(takeUntilDestroyed(this.destroyRef)) // Automatically unsubscribe when the component is destroyed
      .subscribe((counts) => {
        // Map the fetched counts to the corresponding categories
        this.categories.forEach((category, index) => {
          this.categoryProductsCount[category] = counts[index];
        });
      });
  }

  // Method to fetch the total count of products across all categories
  fetchAllProductsCount(): void {
    this.productsService
      .getAllProductsCount() // Call service method to get total product count
      .pipe(takeUntilDestroyed(this.destroyRef)) // Automatically unsubscribe when the component is destroyed
      .subscribe((products) => {
        this.totalProductsCount = products.total; // Store the total count of products
      });
  }

  // Method to handle category changes and emit the selected category to parent components
  onCategoryChange(): void {
    this.categoryChange.emit(this.selectedCategory); // Emit the selected category
    this.updateBreadcrumb(); // Update the breadcrumb navigation
  }

  // Method to update breadcrumb navigation based on the selected category
  updateBreadcrumb(): void {
    this.breadcrumb = ['Home', 'Products', this.selectedCategory]; // Set breadcrumb items
  }
}
