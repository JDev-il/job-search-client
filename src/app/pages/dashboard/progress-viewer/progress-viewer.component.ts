
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, Input, signal } from '@angular/core';
import { ChartData } from '../../../core/models/chart.interface';
import { ITableDataRow } from '../../../core/models/table.interface';
import { ProgressChartComponent } from "../../../shared/components/charts/progress-chart/progress-chart.component";
import { StateService } from '../../../shared/services/state.service';
import { UIService } from '../../../shared/services/ui.service';
@Component({
  selector: 'app-progress-viewer',
  standalone: true,
  templateUrl: './progress-viewer.component.html',
  styleUrl: './progress-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProgressChartComponent]
})

export class ProgressViewerComponent {
  @Input() filteredChartData = signal<ITableDataRow[]>([]);
  @Input() positions = signal<ITableDataRow[]>([]);
  @Input() counter = signal<number>(0);
  @Input() isAnimationRequired?: boolean;
  public chartDataSeriesBuilder = signal<ChartData[]>([]);

  constructor(private cd: ChangeDetectorRef, private uiService: UIService, private stateService: StateService) {
    effect(() => {
      this.chartDataSeriesBuilder.set(this.uiService.chartDataBuilder());
    }, { allowSignalWrites: true });
  }
}
