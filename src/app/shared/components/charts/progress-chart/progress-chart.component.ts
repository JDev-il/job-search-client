import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, effect, inject, ViewEncapsulation } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartDataType1 } from '../../../../core/models/chart.interface';
import { ChartsBaseComponent } from '../../../base/charts-base.component';
import { DataService } from '../../../services/data.service';
import { UIService } from '../../../services/ui.service';
import { BUCKET_COLORS, ChartsService, STATUS_BUCKET_COLORS } from './../../../services/charts.service';

const TOOLTIP_ID = 'progress-chart-tooltip';

@Component({
  selector: 'app-progress-chart',
  imports: [BaseChartDirective],
  templateUrl: './progress-chart.component.html',
  styleUrls: ['./progress-chart.component.scss', '../../../style/charts.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ProgressChartComponent extends ChartsBaseComponent {
  private destroyRef = inject(DestroyRef);

  constructor(cd: ChangeDetectorRef, uiService: UIService, chartsService: ChartsService, dataService: DataService) {
    super(cd, uiService, chartsService, dataService);
    effect(() => {
      this.chartsService.progressChartBuilder();
      this.progressChartOptions.set(this.progressChart());
      this.cd.markForCheck();
    });
    this.destroyRef.onDestroy(() => document.getElementById(TOOLTIP_ID)?.remove());
  }

  private tooltipHandler = (context: { chart: any; tooltip: any }): void => {
    const { chart, tooltip } = context;
    let el = document.getElementById(TOOLTIP_ID) as HTMLDivElement | null;
    if (!el) {
      el = document.createElement('div');
      el.id = TOOLTIP_ID;
      document.body.appendChild(el);
    }
    if (tooltip.opacity === 0) { el.style.opacity = '0'; return; }

    const bucket = tooltip.dataPoints?.[0]?.label as string;
    const count = tooltip.dataPoints?.[0]?.formattedValue ?? '';
    const entries = this.dataService.progressChartCompanies()[bucket] ?? [];

    el.innerHTML = `
      <div style="font-weight:600;margin-bottom:4px">${bucket} (${count})</div>
      ${entries.map(e => `
        <div style="display:flex;align-items:center;gap:6px;padding:2px 0">
          <span style="width:8px;height:8px;border-radius:50%;background:${STATUS_BUCKET_COLORS[e.status] ?? '#6B7280'};flex-shrink:0"></span>
          <span>${e.name}</span>
        </div>`).join('')}
    `;

    const rect = chart.canvas.getBoundingClientRect();
    el.style.cssText = `
      position:fixed;
      opacity:1;
      pointer-events:none;
      background:#1e293b;
      color:#f1f5f9;
      border-radius:6px;
      padding:10px 14px;
      font-size:13px;
      line-height:1.5;
      box-shadow:0 4px 16px -2px #0008;
      z-index:9999;
      left:${rect.left + tooltip.caretX + 12}px;
      top:${rect.top + tooltip.caretY - 12 + window.scrollY}px;
      transition:opacity 0.1s;
    `;
  };

  public progressChart(): ChartConfiguration {
    const data = this.dataService.progressChart() as ChartDataType1[];
    return {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.x),
        datasets: [{
          data: data.map(d => d.y),
          backgroundColor: data.map(d => BUCKET_COLORS[d.x] ?? '#6B7280'),
          borderWidth: 2,
          hoverOffset: 15,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: { display: true, text: 'Applications by Status', align: 'center' },
          legend: { display: true, position: 'bottom' },
          tooltip: {
            enabled: false,
            external: this.tooltipHandler,
          }
        },
        maintainAspectRatio: false,
      }
    } as ChartConfiguration;
  }
}
