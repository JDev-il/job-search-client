import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FollowUpComponent } from '../../../../shared/components/cards/follow-up/follow-up.component';


@Component({
  selector: 'app-dashboard-actions',
  imports: [FollowUpComponent],
  templateUrl: './dashboard-actions.component.html',
  styleUrl: './dashboard-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardActionsComponent {

}
