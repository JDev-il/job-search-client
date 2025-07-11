import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../services/data.service';
import { RoutingService } from '../services/routing.service';

@Component({
  selector: 'app-helper-base',
  template: '',
  standalone: true
})
export class HelperBaseComponent {
  constructor(public dataService: DataService, public authService: AuthService, public routingService: RoutingService) {
    this.dataService.userDataRequest().subscribe({
      next: (userData) => {
        if (!userData) {
          this.authService.logout(); this.routingService.toLogin();
        } else { this.spinnerState = false; }
      },
      error: (err) => console.error(err)
    })
  }

  public get spinnerState(): boolean {
    return this.dataService.spinnerState();
  }
  public set spinnerState(value: boolean) {
    this.dataService.setSpinnerState(value);
  }
}
