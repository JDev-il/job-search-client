import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HelperBaseComponent } from '../../base/helper-base.component';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { RoutingService } from '../../services/routing.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent extends HelperBaseComponent {
  constructor(stateService: StateService, authService: AuthService, routingService: RoutingService) {
    super(stateService, authService, routingService)
  }
}
