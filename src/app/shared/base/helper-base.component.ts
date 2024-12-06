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
    effect(() => {
      this.stateService.userDataRequest().subscribe();
    });
  }
}
