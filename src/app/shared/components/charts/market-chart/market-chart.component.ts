import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, ViewEncapsulation } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MarketChartData } from '../../../../core/models/chart.interface';
import { ChartsBaseComponent } from '../../../base/charts-base.component';
import { DataService } from '../../../services/data.service';
import { BUCKET_COLORS, BUCKET_NAMES, ChartsService } from './../../../services/charts.service';
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

  public marketChart(): ChartConfiguration {
    const data = this.dataService.marketChart() as MarketChartData;
    return {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: BUCKET_NAMES.reduce<unknown[]>((acc, b) => {
          const values = data.buckets[b] ?? [];
          const isValue = values.some(val => val > 0);
          if (isValue) {
            acc.push({
              label: b,
              data: values,
              backgroundColor: BUCKET_COLORS[b],
              stack: 'outcomes'
            })
          }
          return acc
        }, [])
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { stacked: true },
          y: {
            stacked: true,
            ticks: { stepSize: 1 },
            title: { display: true, text: 'Applications' }
          }
        },
        plugins: {
          title: { display: true, text: 'Application Timeline', align: 'center' },
          legend: { display: true, position: 'bottom' },
        }
      }
    } as ChartConfiguration;
  }
}
