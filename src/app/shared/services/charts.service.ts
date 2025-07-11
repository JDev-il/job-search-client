import { Injectable } from '@angular/core';
import { ChartDataType1, ChartDataType2 } from '../../core/models/chart.interface';
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
      .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime()) as ChartDataType1[];
    this.dataService.setProgressChart(chartData);// Ensure progressChart is public/protected as WritableSignal
  }

  public statusChartBuilder(): void {
    const statusChartData = this.chartDataSlicer() as ITableDataRow[];
    const quantityMap = new Map<string, Set<string>>();
    const chartData: ChartDataType2[] = [];
    for (const row of statusChartData) {
      const company = row.companyName;
      const status = row.status;
      if (!quantityMap.has(company)) {
        quantityMap.set(company, new Set());
      }
      quantityMap.get(company)!.add(status);
    }
    quantityMap.forEach((statusSet, company) => {
      const statusesArray = Array.from(statusSet);
      chartData.push({
        x: company,
        y: statusesArray,
      });
    });
    this.dataService.setStatusChart(chartData); // Ensure statusChart is public/protected as WritableSignal
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
