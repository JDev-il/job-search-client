import { Injectable } from '@angular/core';
import { ChartDataType1, ChartDataType2 } from '../../core/models/chart.interface';
import { ITableDataRow } from '../../core/models/table.interface';
import { StateService } from './state.service';

@Injectable({ providedIn: 'root' })
export class ChartsService {
  constructor(private stateService: StateService) { }

  public progressChartBuilder(): void {
    const progressChartData = this.chartDataSlicer();
    const dateCountMap = new Map<string, number>();
    for (const row of progressChartData) {
      const companyName = row.companyName!.toString()
      dateCountMap.set(companyName, (dateCountMap.get(companyName) || 0) + 1);
    }
    const chartData = Array.from(dateCountMap.entries())
      .map(([x, y]) => ({ x, y }))
      .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime()) as ChartDataType1[];
    this.stateService.progressChart.set(chartData);
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

    // Converting into ApexCharts Format:
    const s = quantityMap.forEach((statusSet, company) => {
      const statusesArray = Array.from(statusSet);
      chartData.push({
        x: company,
        y: statusesArray,
      });
    });
    this.stateService.statusChart.set(chartData);
  }

  private chartDataSlicer(): ITableDataRow[] {
    let data: ITableDataRow[] = [] as ITableDataRow[];
    if (this.stateService.daysFilter() === 0) {
      data = this.stateService.tableDataResponse$.slice();
    } else {
      data = this.stateService.globalFilteredData$.slice();
    }
    return data;
  }
}
