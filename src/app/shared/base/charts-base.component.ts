import { ChangeDetectorRef, Component, effect, signal } from "@angular/core";
import { ChartConfiguration } from "chart.js";
import { ChartsService } from "../services/charts.service";
import { DataService } from "../services/data.service";
import { UIService } from "../services/ui.service";

@Component({
  standalone: true,
  template: ''
})
export class ChartsBaseComponent {
  public applicationByStatus = signal<ChartConfiguration>({} as ChartConfiguration);
  public statusChartOptions = signal<ChartConfiguration>({} as ChartConfiguration);
  public timelineChartOptions = signal<ChartConfiguration>({} as ChartConfiguration);
  public isChartsReady = {
    isByStatusChart: signal<boolean>(false),
    isStatusChart: signal<boolean>(false),
    isTimelineChart: signal<boolean>(false),
  };

  constructor(protected cd: ChangeDetectorRef, protected uiService: UIService, protected chartsService: ChartsService, protected dataService: DataService) {
    effect(() => {
      this.areChartsReady();
    })
  }

  private areChartsReady(): void {
    this.isChartsReady.isByStatusChart.set(this.dataService.applicationsChart().length > 0);
    this.isChartsReady.isStatusChart.set(this.dataService.statusChart().length > 0);
    this.isChartsReady.isTimelineChart.set(this.dataService.timelineChart().labels.length > 0);
  }
}
