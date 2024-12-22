import { Component, effect } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { RoutingService } from '../services/routing.service';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-base-auth',
  template: '',
  standalone: true
})
export class HelperBaseComponent {
  constructor(public stateService: StateService, public authService: AuthService, public routingService: RoutingService) {
    // this.spinnerState = true;
    effect(() => {
      this.stateService.userDataRequest().subscribe();
    });
  }
  public get spinnerState(): boolean {
    return this.stateService.spinnerState;
  }

  public set spinnerState(value: boolean) {
    this.stateService.spinnerState = value;
  }
}
