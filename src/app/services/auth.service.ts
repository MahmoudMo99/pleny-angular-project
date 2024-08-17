import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ILoginRequest } from 'src/app/models/ilogin-request';
import { ILoginResponse } from 'src/app/models/ilogin-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // BehaviorSubjects allow components to subscribe and get updates on whether the user is logged in
  // BehaviorSubject to track the user's login status
  private loggedIn = new BehaviorSubject<boolean>(false);
  private tokenKey = 'authToken'; // Key for storing the token in localStorage

  constructor(private http: HttpClient) {
    this.checkLoginStatus(); // Check login status when the service is initialized
  }

  // Method to handle user login
  login(user: ILoginRequest): Observable<boolean> {
    return this.http.post<ILoginResponse>(environment.loginUrl, user).pipe(
      map((response) => {
        if (response.token) {
          this.saveToken(response); // Save the token if the response contains one
          return true; // Return true if login is successful
        } else {
          return false; // Return false if login fails
        }
      }),
      catchError(() => {
        this.loggedIn.next(false); // Set loggedIn to false if an error occurs
        return [false]; // Return false in case of an error
      })
    );
  }

  // Method to save the token in localStorage and update the login status
  saveToken(response: ILoginResponse): void {
    localStorage.setItem(this.tokenKey, response.token); // Save the token in localStorage
    this.loggedIn.next(true); // Set loggedIn to true
  }

  // Method to logout the user
  logout(): void {
    localStorage.removeItem(this.tokenKey); // Remove the token from localStorage
    this.loggedIn.next(false); // Set loggedIn to false
  }

  // Method to check if the user is authenticated
  isAuthenticated(): Observable<boolean> {
    return this.loggedIn.asObservable(); // Return an observable of the loggedIn status
  }

  // Private method to check the login status based on the presence of a token
  private checkLoginStatus(): void {
    const token = localStorage.getItem(this.tokenKey); // Retrieve the token from localStorage
    this.loggedIn.next(!!token); // Update the loggedIn status based on the presence of the token
  }
}
