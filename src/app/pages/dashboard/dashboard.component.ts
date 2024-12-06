import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  // imports: [RouterOutlet, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  // sidebarOpen = signal(false); // Signal to toggle sidebar visibility
  // toggleSidebar() {
  //   this.sidebarOpen.update((state) => !state);
  // }

  //TODO:
  // > continue constructing the dashboard's sidebar
  // > link sidebar routes to desired endpoints / pages that will be loaded into DashboardComponent area ['Dashboard']
}
