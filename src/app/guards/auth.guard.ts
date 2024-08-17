import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { map } from 'rxjs/operators';

// Defining an auth guard function that implements CanActivateFn
export const authGuard: CanActivateFn = (route, state) => {
  // Injecting the AuthService, Router, and AlertService
  //( The inject function is used to get instances of services )
  const authService = inject(AuthService);
  const router = inject(Router);
  const alertService = inject(AlertService);

  // Checking if the user is authenticated by calling isAuthenticated method from the AuthService
  return authService.isAuthenticated().pipe(
    // Using the 'map' operator to transform the authentication status
    map((isAuthenticated: boolean) => {
      if (isAuthenticated) {
        // If the user is authenticated, allow to access to the route
        return true;
      } else {
        // If the user is not authenticated, display an alert message and navigate to the login page
        alertService.showAlert('You are not authenticated!', 'error');
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
