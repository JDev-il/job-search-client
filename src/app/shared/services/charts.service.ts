import { Injectable } from '@angular/core';
import { ChartDataType1 } from '../../core/models/chart.interface';
import { ITableDataRow } from '../../core/models/table.interface';
import { DataService } from './data.service';

@Injectable({ providedIn: 'root' })
export class ChartsService {
  constructor(private dataService: DataService) { }

  public progressChartBuilder(): void {
    const progressChartData = this.chartDataSlicer();
    const dateCountMap = new Map<string, number>();
    for (const row of progressChartData) {
      const companyName = row.companyName!.toString();
      dateCountMap.set(companyName, (dateCountMap.get(companyName) || 0) + 1);
    }
    const chartData = Array.from(dateCountMap.entries())
      .map(([x, y]) => ({ x, y }))
      .sort((a, b) => b.y - a.y) as ChartDataType1[];
    this.dataService.setProgressChart(chartData);
  }

  public statusChartBuilder(): void {
    const statusChartData = this.chartDataSlicer();
    const statusCountMap = new Map<string, number>();
    for (const row of statusChartData) {
      const status = row.status.toString();
      statusCountMap.set(status, (statusCountMap.get(status) || 0) + 1);
    }
    const chartData = Array.from(statusCountMap.entries())
      .map(([x, y]) => ({ x, y }))
      .sort((a, b) => b.y - a.y) as ChartDataType1[];
    this.dataService.setStatusChart(chartData);
  }

  public marketChartBuilder(): void {
    const data = this.chartDataSlicer();
    const dateCountMap = new Map<string, number>();
    for (const row of data) {
      if (!row.applicationDate) continue;
      const date = new Date(row.applicationDate.toString()).toLocaleDateString('en-GB');
      dateCountMap.set(date, (dateCountMap.get(date) || 0) + 1);
    }
    const chartData = Array.from(dateCountMap.entries())
      .map(([x, y]) => ({ x, y }))
      .sort((a, b) => {
        const [da, ma, ya] = a.x.split('/').map(Number);
        const [db, mb, yb] = b.x.split('/').map(Number);
        return new Date(ya, ma - 1, da).getTime() - new Date(yb, mb - 1, db).getTime();
      }) as ChartDataType1[];
    this.dataService.setMarketChart(chartData);
  }

  private chartDataSlicer(): ITableDataRow[] {
    let data: ITableDataRow[] = [];
    if (this.dataService.daysFilter() === 0) {
      data = this.dataService.tableDataResponse().slice();
    } else {
      data = this.dataService.globalFilteredData().slice();
    }
    return data;
  }
}
