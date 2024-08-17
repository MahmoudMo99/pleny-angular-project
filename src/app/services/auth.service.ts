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
  private loggedIn = new BehaviorSubject<boolean>(false);
  private tokenKey = 'authToken';

  constructor(private http: HttpClient) {
    this.checkLoginStatus();
  }

  login(user: ILoginRequest) {
    return this.http.post<ILoginResponse>(environment.loginUrl, user).pipe(
      map((response) => {
        if (response.token) {
          this.saveToken(response);
          return true;
        } else {
          return false;
        }
      }),
      catchError(() => {
        this.loggedIn.next(false);
        return [false];
      })
    );
  }

  saveToken(response: ILoginResponse) {
    localStorage.setItem(this.tokenKey, response.token);
    this.loggedIn.next(true);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  private checkLoginStatus(): void {
    const token = localStorage.getItem(this.tokenKey);
    this.loggedIn.next(!!token);
  }
}
