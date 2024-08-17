import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: Set<number> = new Set(); // Use Set to store unique product IDs
  private cartItemCountSubject = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCountSubject.asObservable();

  constructor() {
    this.loadCart();
  }

  addToCart(productId: number): void {
    this.cartItems.add(productId);
    this.updateCartItemCount();
  }

  removeFromCart(productId: number): void {
    this.cartItems.delete(productId);
    this.updateCartItemCount();
  }

  isInCart(productId: number): boolean {
    return this.cartItems.has(productId);
  }

  getCartItemCount(): number {
    return this.cartItems.size;
  }

  private updateCartItemCount(): void {
    this.cartItemCountSubject.next(this.getCartItemCount());
    this.saveCart();
  }

  private saveCart(): void {
    localStorage.setItem(
      'cartItems',
      JSON.stringify(Array.from(this.cartItems))
    );
  }

  private loadCart(): void {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      this.cartItems = new Set(JSON.parse(savedCart));
      this.updateCartItemCount();
    }
  }
}
