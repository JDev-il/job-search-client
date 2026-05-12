import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, ViewEncapsulation } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TimelineChartData } from '../../../../core/models/chart.interface';
import { ChartsBaseComponent } from '../../../base/charts-base.component';
import { BUCKET_COLORS, BUCKET_NAMES } from '../../../constants/charts';
import { ChartsService } from '../../../services/charts.service';
import { DataService } from '../../../services/data.service';
import { UIService } from '../../../services/ui.service';

@Component({
  selector: 'app-timeline-chart',
  imports: [BaseChartDirective],
  templateUrl: './timeline-chart.component.html',
  styleUrls: ['./timeline-chart.component.scss', '../../../style/charts.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class TimelineChartComponent extends ChartsBaseComponent {
  constructor(cd: ChangeDetectorRef, uiService: UIService, chartsService: ChartsService, dataService: DataService) {
    super(cd, uiService, chartsService, dataService);
    effect(() => {
      this.chartsService.timelineChartBuilder();
      this.timelineChartOptions.set(this.timelineChart());
      this.cd.markForCheck();
    });
  }

  public timelineChart(): ChartConfiguration {
    const data = this.dataService.timelineChart() as TimelineChartData;
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
        aspectRatio: 1,
        layout: { padding: { top: 15, bottom: 15, right: 50, left: 25 } },
        maintainAspectRatio: false,
        animation: { easing: 'easeInOutExpo', duration: 650 },
        plugins: {
          title: { display: true, text: 'Application Timeline', align: 'center', font: { size: 16 } },
          legend: { display: true, position: 'bottom' }
        },
        scales: {
          x: { stacked: true },
          y: {
            stacked: true,
            ticks: { stepSize: 1 },
            title: { display: true, text: 'Applications' },
          }
        },
      }
    } as ChartConfiguration;
  }
}
