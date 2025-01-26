import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RoutingService } from '../services/routing.service';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-helper-base',
  template: '',
  standalone: true
})
export class HelperBaseComponent {
  constructor(public stateService: StateService, public authService: AuthService, public routingService: RoutingService) {
    this.stateService.userDataRequest().subscribe({
      next: (data) => { if (!data) { this.authService.logout(); this.routingService.toLogin() } else { this.spinnerState = false; } },
      error: (err) => console.error(err)
    })
    if (!this.stateService.allCountries.length) {
      this.stateService.getAllCountries().subscribe();
    }
  }

  public get spinnerState(): boolean {
    return this.stateService.spinnerState;
  }

  public set spinnerState(value: boolean) {
    this.stateService.spinnerState = value;
  }
}
