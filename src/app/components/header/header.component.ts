// header.component.ts
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
  isAuthenticated: boolean = false;
  cartItemCount: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private searchService: SearchService, // Inject the SearchService
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe((authStatus) => {
      this.isAuthenticated = authStatus;
    });

    this.cartService.cartItemCount$.subscribe((count) => {
      this.cartItemCount = count;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchService.updateSearchTerm(target.value); // Use SearchService to update the search term
  }
}
