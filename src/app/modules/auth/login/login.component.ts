import { Component, DestroyRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup; // The form group for managing the login form controls

  constructor(
    private fb: FormBuilder, // Service for building the reactive form
    private authService: AuthService, // Service for handling authentication
    private router: Router, // Service for navigation between routes
    private alertService: AlertService, // Service for displaying alerts
    private destroyRef: DestroyRef // Utility for managing subscriptions to avoid memory leaks
  ) {
    // Initializing the form group with form controls for username and password
    this.loginForm = this.fb.group({
      username: ['emilys', [Validators.required]], // Username with a default value and required validation
      password: ['emilyspass', [Validators.required]], // Password with a default value and required validation
      // note : I setted this default value for the username and password which i got from the API documentation to can login
    });
  }

  // Method triggered when the form is submitted
  onSubmit() {
    // Check if the form is invalid
    if (this.loginForm.invalid) {
      // Display an error alert if the form is not filled out correctly
      this.alertService.showAlert(
        'Please enter your username and password',
        'error'
      );
      return; // Exit the method if the form is invalid
    }

    // Attempt to log in using the AuthService with the form values
    this.authService
      .login(this.loginForm.value) // Pass the form values (username and password) to the login method
      .pipe(takeUntilDestroyed(this.destroyRef)) // Automatically unsubscribe when the component is destroyed
      .subscribe((success) => {
        if (success) {
          // If login is successful, show a success alert and navigate to the products page
          this.alertService.showAlert('Login Successfully', 'success');
          this.router.navigate(['/products']);
        } else {
          // If login fails, show an error alert
          this.alertService.showAlert('Invalid username or password', 'error');
        }
      });
  }
}
