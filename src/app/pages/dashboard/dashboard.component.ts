import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CentralHubComponent } from "./central-hub/central-hub.component";
import { SidebarComponent } from './sidebar/sidebar.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    SidebarComponent,
    CentralHubComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  //TODO:
  // > continue constructing the dashboard's sidebar
  // > link sidebar routes to desired endpoints / pages that will be loaded into DashboardComponent area ['Dashboard']
}
