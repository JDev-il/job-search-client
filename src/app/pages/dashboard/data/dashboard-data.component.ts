import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { signal } from '@angular/core';
import { ProgressChartComponent } from '../../../shared/components/charts/progress-chart/progress-chart.component';
import { StatusChartComponent } from '../../../shared/components/charts/status-chart/status-chart.component';
import { MarketChartComponent } from '../../../shared/components/charts/market-chart/market-chart.component';

const CHART_ORDER_KEY = 'chart-order';
const DEFAULT_ORDER = ['progress', 'status', 'market'];

@Component({
  selector: 'app-dashboard-data',
  imports: [CdkDropList, CdkDrag, ProgressChartComponent, StatusChartComponent, MarketChartComponent],
  templateUrl: './dashboard-data.component.html',
  styleUrl: './dashboard-data.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardDataComponent {
  public chartOrder = signal<string[]>(this.loadChartOrder());

  private loadChartOrder(): string[] {
    const saved = localStorage.getItem(CHART_ORDER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as string[];
      if (parsed.length === DEFAULT_ORDER.length) return parsed;
    }
    return [...DEFAULT_ORDER];
  }

  public onChartDrop(event: CdkDragDrop<string[]>): void {
    const order = this.chartOrder().slice();
    moveItemInArray(order, event.previousIndex, event.currentIndex);
    this.chartOrder.set(order);
    localStorage.setItem(CHART_ORDER_KEY, JSON.stringify(order));
  }
}
