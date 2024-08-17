import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // A Set is used to store unique product IDs, ensuring no duplicate products are added to the cart
  private cartItems: Set<number> = new Set();
  private cartItemCountSubject = new BehaviorSubject<number>(0); // BehaviorSubject to track the number of items in the cart
  // An observable of the cart items count, allowing other components to subscribe and react to changes
  cartItemsCount$ = this.cartItemCountSubject.asObservable();

  private cartItemskey = 'cartItems'; // Key for storing the cart items in localStorage

  constructor() {
    this.loadCart(); // Load cart items from localStorage when the service is initialized
  }

  // Method to add a product to the cart
  addToCart(productId: number): void {
    this.cartItems.add(productId); // Add the product ID to the Set
    this.updateCartItemCount(); // Update the cart items count and save the cart
  }

  // Method to remove a product from the cart
  removeFromCart(productId: number): void {
    this.cartItems.delete(productId); // Remove the product ID from the Set
    this.updateCartItemCount(); // Update the cart items count and save the cart
  }

  // Method to check if a product is in the cart
  isInCart(productId: number): boolean {
    return this.cartItems.has(productId); // Return true if the product ID is in the Set, false otherwise
  }

  // Method to get the number of items in the cart
  getCartItemCount(): number {
    return this.cartItems.size; // Return the size of the Set (number of items in the cart)
  }

  // Private method to update the cart item count and save the cart
  private updateCartItemCount(): void {
    this.cartItemCountSubject.next(this.getCartItemCount()); // Emit the new cart items count
    this.saveCart(); // Save the current state of the cart to localStorage
  }

  // Private method to save the cart items to localStorage
  private saveCart(): void {
    localStorage.setItem(
      this.cartItemskey,
      JSON.stringify(Array.from(this.cartItems)) // Convert the Set to an array and save it as a JSON string
    );
  }

  // Private method to load the cart items from localStorage
  private loadCart(): void {
    const savedCart = localStorage.getItem(this.cartItemskey); // Retrieve the cart items from localStorage
    if (savedCart) {
      this.cartItems = new Set(JSON.parse(savedCart)); // Parse the JSON string and convert it back to a Set
      this.updateCartItemCount(); // Update the cart items count with the loaded items
    }
  }
}
