import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, ViewEncapsulation } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartDataType1 } from '../../../../core/models/chart.interface';
import { ChartsBaseComponent } from '../../../base/charts-base.component';
import { DataService } from '../../../services/data.service';
import { ChartsService } from './../../../services/charts.service';
import { UIService } from './../../../services/ui.service';

@Component({
    selector: 'app-market-chart',
  imports: [BaseChartDirective],
    templateUrl: './market-chart.component.html',
    styleUrls: ['./market-chart.component.scss', '../../../style/charts.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class MarketChartComponent extends ChartsBaseComponent {
  constructor(cd: ChangeDetectorRef, uiService: UIService, chartsService: ChartsService, dataService: DataService) {
    super(cd, uiService, chartsService, dataService);
    effect(() => {
      this.chartsService.marketChartBuilder();
      this.marketChartOptions.set(this.marketChart());
      this.cd.markForCheck();
    });
  }

  private movingAverage(values: number[], window: number): (number | null)[] {
    return values.map((_, i) => {
      if (i < window - 1) return null;
      const slice = values.slice(i - window + 1, i + 1);
      return Math.round((slice.reduce((s, v) => s + v, 0) / window) * 10) / 10;
    });
  }

  public marketChart(): ChartConfiguration {
    const data = this.dataService.marketChart() as ChartDataType1[];
    const values = data.map(d => d.y);
    const maxY = data.length ? Math.max(...values) + 1 : 10;
    const maData = this.movingAverage(values, 3);
    return {
      type: 'line',
      data: {
        labels: data.map(d => d.x),
        datasets: [
          {
            label: 'Applications',
            data: values,
            fill: true,
            borderColor: '#077AFF',
            backgroundColor: 'rgba(7, 122, 255, 0.10)',
            pointBackgroundColor: '#077AFF',
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.4,
          },
          {
            label: '3-week avg',
            data: maData,
            fill: false,
            borderColor: 'rgba(148, 163, 184, 0.85)',
            pointRadius: 0,
            tension: 0.4,
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            max: maxY,
            ticks: { format: '' },
            title: { display: true, text: 'CV Sent' },
            'alignToPixels': true
          }
        },
        plugins: {
          title: { display: true, text: 'Application Timeline', align: 'center' },
          legend: { display: true, position: 'bottom' },
        },
        maintainAspectRatio: false,
      }
    } as ChartConfiguration;
  }
}
