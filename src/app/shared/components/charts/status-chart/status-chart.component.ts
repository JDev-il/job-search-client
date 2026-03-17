import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, signal, ViewEncapsulation } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartDataType1 } from '../../../../core/models/chart.interface';
import { ChartsBaseComponent } from '../../../base/charts-base.component';
import { DataService } from '../../../services/data.service';
import { ChartsService, STATUS_BUCKET_COLORS } from './../../../services/charts.service';
import { UIService } from './../../../services/ui.service';

interface StatusTooltipState {
  status: string;
  count: string;
  color: string;
  companies: string[];
  x: number;
  y: number;
}

@Component({
  selector: 'app-status-chart',
  imports: [BaseChartDirective],
  templateUrl: './status-chart.component.html',
  styleUrls: ['./status-chart.component.scss', '../../../style/charts.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class StatusChartComponent extends ChartsBaseComponent {
  public tooltipState = signal<StatusTooltipState | null>(null);

  constructor(cd: ChangeDetectorRef, uiService: UIService, chartsService: ChartsService, dataService: DataService) {
    super(cd, uiService, chartsService, dataService);
    effect(() => {
      this.chartsService.statusChartBuilder();
      this.statusChartOptions.set(this.statusChart());
      this.cd.markForCheck();
    });
  }

  private tooltipHandler = (context: { chart: any; tooltip: any }): void => {
    const { chart, tooltip } = context;
    if (tooltip.opacity === 0) { this.tooltipState.set(null); return; }

    const status = tooltip.dataPoints?.[0]?.label as string;
    const count = tooltip.dataPoints?.[0]?.formattedValue ?? '';
    const companies = this.dataService.statusChartCompanies()[status] ?? [];
    const color = STATUS_BUCKET_COLORS[status] ?? '#6B7280';
    const rect = chart.canvas.getBoundingClientRect();

    this.tooltipState.set({
      status, count, color, companies,
      x: rect.left + tooltip.caretX + 12,
      y: rect.top + tooltip.caretY - 12 + window.scrollY,
    });
  };

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
          tooltip: { enabled: false, external: this.tooltipHandler },
        },
        maintainAspectRatio: false,
      }
    } as ChartConfiguration;
  }
}
