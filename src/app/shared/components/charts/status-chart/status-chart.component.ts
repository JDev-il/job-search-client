import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, ViewEncapsulation } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartDataType1 } from '../../../../core/models/chart.interface';
import { ChartsBaseComponent } from '../../../base/charts-base.component';
import { DataService } from '../../../services/data.service';
import { ChartsService, STATUS_BUCKET_COLORS } from './../../../services/charts.service';
import { UIService } from './../../../services/ui.service';

@Component({
  selector: 'app-status-chart',
  imports: [BaseChartDirective],
  templateUrl: './status-chart.component.html',
  styleUrls: ['./status-chart.component.scss', '../../../style/charts.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class StatusChartComponent extends ChartsBaseComponent {
  constructor(cd: ChangeDetectorRef, uiService: UIService, chartsService: ChartsService, dataService: DataService) {
    super(cd, uiService, chartsService, dataService);
    effect(() => {
      this.chartsService.statusChartBuilder();
      this.statusChartOptions.set(this.statusChart());
      this.cd.markForCheck();
    })
  }

  public statusChart(): ChartConfiguration {
    const data = this.dataService.statusChart() as ChartDataType1[];
    const maxX = data.length ? Math.max(...data.map(d => d.y)) + 1 : 10;
    return {
      type: 'bar',
      data: {
        labels: data.map(d => d.x),
        datasets: [{
          label: 'Applications',
          data: data.map(d => d.y),
          backgroundColor: data.map(d => STATUS_BUCKET_COLORS[d.x] ?? '#6B7280'),
          hoverBackgroundColor: data.map(d => (STATUS_BUCKET_COLORS[d.x] ?? '#6B7280') + 'CC'),
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        scales: {
          x: {
            max: maxX,
            ticks: { stepSize: 1 },
            title: { display: true, text: 'Applications' }
          }
        },
        plugins: {
          title: { display: true, text: 'Status Breakdown', align: 'center' },
          legend: { display: false },
        },
        maintainAspectRatio: false,
      }
    } as ChartConfiguration;
  }
}
