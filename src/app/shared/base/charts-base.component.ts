import { ChangeDetectorRef, Component, effect, signal } from "@angular/core";
import { IChartOptions } from "../../core/models/chart.interface";
import { ChartsService } from "../services/charts.service";
import { DataService } from "../services/data.service";
import { UIService } from "../services/ui.service";

@Component({
  standalone: true,
  template: ''
})
export class ChartsBaseComponent {
  public progressChartOptions = signal<IChartOptions>({} as IChartOptions);
  public statusChartOptions = signal<IChartOptions>({} as IChartOptions);
  public isChartsReady = {
    isProgressChart: signal<boolean>(false),
    isStatusChart: signal<boolean>(false),
    isMarketChart: signal<boolean>(false),
  };

  constructor(protected cd: ChangeDetectorRef, protected uiService: UIService, protected chartsService: ChartsService, protected dataService: DataService) {
    effect(() => {
      this.areChartsReady();
    }, { allowSignalWrites: true })
  }

  private areChartsReady(): void {
    this.dataService.progressChart().length > 0 ? this.isChartsReady.isProgressChart.set(true) : this.isChartsReady.isProgressChart.set(false);
    this.dataService.statusChart().length > 0 ? this.isChartsReady.isStatusChart.set(true) : this.isChartsReady.isStatusChart.set(false);
    // this.stateService.progressChart().length ? this.isChartsReady.isProgressChart.set(true);
  }
}
