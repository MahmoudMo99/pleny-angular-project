import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/services/search.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean = false; // Boolean to track the authentication status
  cartItemsCount: number = 0; // Variable to hold the number of items in the cart

  constructor(
    private authService: AuthService, // Inject AuthService for handling authentication
    private router: Router, // Inject Router for navigation
    private searchService: SearchService, // Inject SearchService for search functionality
    private cartService: CartService // Inject CartService for cart management
  ) {}

  ngOnInit(): void {
    // Subscribe to the authentication status
    this.authService.isAuthenticated().subscribe((authStatus) => {
      this.isAuthenticated = authStatus; // Update the authentication status
    });

    // Subscribe to the cart items count observable
    this.cartService.cartItemsCount$.subscribe((count) => {
      this.cartItemsCount = count; // Update the cart items count
    });
  }

  // Method to handle user logout
  logout(): void {
    this.authService.logout(); // Call logout method from AuthService
    this.router.navigate(['/login']); // Navigate to the login page
  }

  // Method to handle search input changes
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement; // Get the input element from the event
    this.searchService.updateSearchTerm(target.value); // Update the search term using SearchService
  }
}
