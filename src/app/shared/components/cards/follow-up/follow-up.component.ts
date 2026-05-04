import { ChangeDetectionStrategy, Component, computed, effect, inject, ViewEncapsulation } from '@angular/core';
import { ChartsService } from '../../../services/charts.service';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-follow-up',
  imports: [],
  templateUrl: './follow-up.component.html',
  styleUrl: './follow-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class FollowUpComponent {
  private dataService = inject(DataService);
  private chartsService = inject(ChartsService);
  public followUps = computed(() => this.dataService.followUpData());
  constructor() {
    effect(() => this.chartsService.followUpDataBuilder());
  }
}
