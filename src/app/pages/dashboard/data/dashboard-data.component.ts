import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ApplicationByStatusComponent } from "../../../shared/components/charts/application-by-status/application-by-status.component";
import { StatusChartComponent } from '../../../shared/components/charts/status-chart/status-chart.component';
import { TimelineChartComponent } from '../../../shared/components/charts/timeline-chart/timeline-chart.component';
import { CHART_ORDER_KEY, DEFAULT_ORDER } from '../../../shared/constants/charts';
@Component({
  selector: 'app-dashboard-data',
  imports: [CdkDropList, CdkDrag, StatusChartComponent, TimelineChartComponent, ApplicationByStatusComponent],
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
