import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit {
  message: string | null = null; // Variable to hold the alert message
  type: 'success' | 'error' | null = null; // Variable to hold the alert type (success or error)

  constructor(private alertService: AlertService) {} // Inject AlertService into the component

  // Lifecycle hook that is called after the component is initialized
  ngOnInit() {
    this.showAlert(); // Start listening for alert updates when the component is initialized
  }

  // Method to subscribe to alert updates from the AlertService
  showAlert() {
    this.alertService.alert$.subscribe((alert) => {
      this.message = alert.message; // Set the alert message
      this.type = alert.type; // Set the alert type
      if (this.message) {
        // If there is a message, clear the alert after 3 seconds
        setTimeout(() => this.clearAlert(), 3000);
      }
    });
  }

  // Private method to clear the alert message and type
  private clearAlert() {
    this.message = null; // Reset the message
    this.type = null; // Reset the type
  }
}
