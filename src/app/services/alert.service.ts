import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  // BehaviorSubject holds the current state and emits changes to its subscribers
  // It starts with an initial state of { message: null, type: null } meaning no alert is currently active.
  private alertSubject = new BehaviorSubject<{
    message: string | null; // Message to display in the alert
    type: 'success' | 'error' | null; // Type of alert : success or error
  }>({ message: null, type: null }); // Initial state with no message and no type

  // An observable derived from alertSubject that other components can subscribe to in order to receive updates when the alert state changes
  alert$ = this.alertSubject.asObservable();

  // Method to show an alert with a message and type (success or error)
  showAlert(message: string, type: 'success' | 'error') {
    // Update the BehaviorSubject with the new alert message and type
    this.alertSubject.next({ message, type });
    // Automatically clear the alert after 3 seconds
    setTimeout(() => this.clearAlert(), 3000);
  }

  // Private method to clear the alert by resetting the state in the BehaviorSubject
  private clearAlert() {
    this.alertSubject.next({ message: null, type: null });
  }
}
