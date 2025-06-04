import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, signal } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { StateService } from '../../../services/state.service';
import { UIService } from '../../../services/ui.service';
import { IChartOptions } from './../../../../core/models/chart.interface';
import { ChartsService } from './../../../services/charts.service';

@Component({
  selector: 'app-progress-chart',
  standalone: true,
  imports: [
    NgApexchartsModule,
  ],
  templateUrl: './progress-chart.component.html',
  styleUrl: './progress-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressChartComponent {
  public chartOptions = signal<IChartOptions>({} as IChartOptions);
  public isChartReady = signal<boolean>(false);
  constructor(private cd: ChangeDetectorRef, private uiService: UIService, private chartsService: ChartsService, private stateService: StateService) {
    effect(() => {
      this.chartsService.chartDataBuilder()
      this.uiService.chartReady ? this.isChartReady.set(true) : this.isChartReady.set(false);
      this.chartOptions.set(this.chartsService.progressChart());
      this.cd.markForCheck();
    }, { allowSignalWrites: true })
  }
}
