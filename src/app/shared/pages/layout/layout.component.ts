import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HelperBaseComponent } from '../../base/helper-base.component';
import { NavigationComponent } from '../../components/navigation/navigation.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { DataService } from '../../services/data.service';
import { RoutingService } from '../../services/routing.service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, NavigationComponent, SpinnerComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent extends HelperBaseComponent implements OnInit {
  constructor(dataService: DataService, authService: AuthService, routingService: RoutingService) {
    super(dataService, authService, routingService);
  }

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      this.dataService.gmailStatus(token).subscribe();
    }
  }
}
