import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FaderDirective } from '../../../shared/directives/fader.directive';


@Component({
  selector: 'app-dashboard-actions',
  imports: [FaderDirective],
  templateUrl: './dashboard-actions.component.html',
  styleUrl: './dashboard-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardActionsComponent {

}
