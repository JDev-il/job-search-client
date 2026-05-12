import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, signal, ViewEncapsulation } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartDataType1 } from '../../../../core/models/chart.interface';
import { ChartsBaseComponent } from '../../../base/charts-base.component';
import { BUCKET_COLORS, STATUS_BUCKET_COLORS } from '../../../constants/charts';
import { DataService } from '../../../services/data.service';
import { UIService } from '../../../services/ui.service';
import { ByStatusTooltipState } from './../../../../core/models/chart.interface';
import { ChartsService } from './../../../services/charts.service';


@Component({
  selector: 'app-by-status-chart',
  imports: [BaseChartDirective],
  templateUrl: './application-by-status.component.html',
  styleUrls: ['./application-by-status.component.scss', '../../../style/charts.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ApplicationByStatusComponent extends ChartsBaseComponent {
  public tooltipState = signal<ByStatusTooltipState | null>(null);
  public statusColors = STATUS_BUCKET_COLORS;

  constructor(cd: ChangeDetectorRef, uiService: UIService, chartsService: ChartsService, dataService: DataService) {
    super(cd, uiService, chartsService, dataService);
    effect(() => {
      this.chartsService.byStatusChartBuilder();
      this.applicationByStatus.set(this.applicationsChart());
      this.cd.markForCheck();
    });
  }

  private tooltipHandler = (context: { chart: any; tooltip: any }): void => {
    const { chart, tooltip } = context;
    if (tooltip.opacity === 0) { this.tooltipState.set(null); return; }

    const bucket = tooltip.dataPoints?.[0]?.label as string;
    const count = tooltip.dataPoints?.[0]?.formattedValue ?? '';
    const entries = this.dataService.byStatusChartCompanies()[bucket] ?? [];
    const rect = chart.canvas.getBoundingClientRect();

    this.tooltipState.set({
      bucket, count, entries,
      x: rect.left + tooltip.caretX + 12,
      y: rect.top + tooltip.caretY - 12 + window.scrollY,
    });
  };

  public applicationsChart(): ChartConfiguration {
    const data = this.dataService.applicationsChart() as ChartDataType1[];
    return {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.x),
        datasets: [{
          data: data.map(d => d.y),
          backgroundColor: data.map(d => BUCKET_COLORS[d.x] ?? '#6B7280'),
          borderWidth: 1,
          hoverBorderWidth: 3,
          hoverOffset: 3,
          animation: { easing: 'easeInOutCirc', duration: 400 },
        }],
      },
      options: {
        aspectRatio: 1,
        layout: { padding: { top: 15, bottom: 15, right: 50, left: 25 } },
        responsive: true,
        plugins: {
          title: { display: true, text: 'Applications by Status', align: 'center', font: { size: 16 } },
          legend: { display: true, position: 'bottom' },
          tooltip: { enabled: false, external: this.tooltipHandler },
        },
        maintainAspectRatio: false,
      }
    } as ChartConfiguration;
  }
}
