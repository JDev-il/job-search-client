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
  public progressChartOptions = signal<ChartConfiguration>({} as ChartConfiguration);
  public statusChartOptions = signal<ChartConfiguration>({} as ChartConfiguration);
  public marketChartOptions = signal<ChartConfiguration>({} as ChartConfiguration);
  public isChartsReady = {
    isProgressChart: signal<boolean>(false),
    isStatusChart: signal<boolean>(false),
    isMarketChart: signal<boolean>(false),
  };

  constructor(protected cd: ChangeDetectorRef, protected uiService: UIService, protected chartsService: ChartsService, protected dataService: DataService) {
    effect(() => {
      this.areChartsReady();
    })
  }

  private areChartsReady(): void {
    this.isChartsReady.isProgressChart.set(this.dataService.progressChart().length > 0);
    this.isChartsReady.isStatusChart.set(this.dataService.statusChart().length > 0);
    this.isChartsReady.isMarketChart.set(this.dataService.marketChart().length > 0);
  }
}
