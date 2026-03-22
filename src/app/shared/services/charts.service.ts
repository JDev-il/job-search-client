import { Injectable } from '@angular/core';
import { ChartDataType1 } from '../../core/models/chart.interface';
import { ITableDataRow } from '../../core/models/table.interface';
import { PIPELINE_ACTIVE, PIPELINE_CLOSED, PIPELINE_PASSED, PIPELINE_PENDING, PIPELINE_REJECTED } from '../constants/charts';
import { DataService } from './data.service';

@Injectable({ providedIn: 'root' })
export class ChartsService {

  constructor(private dataService: DataService) { }

  public progressChartBuilder(): void {
    const data = this.chartDataSlicer();
    const buckets: Record<string, number> = {
      'Pending': 0, 'Active': 0, 'Passed': 0, 'Rejected': 0, 'Decided to pass': 0
    };
    const companies: Record<string, Array<{ name: string; status: string }>> = {
      'Pending': [], 'Active': [], 'Passed': [], 'Rejected': [], 'Decided to pass': []
    };
    for (const row of data) {
      const entry = { name: row.companyName, status: row.status };
      if (PIPELINE_PENDING.has(row.status)) { buckets['Pending']++; companies['Pending'].push(entry); }
      else if (PIPELINE_ACTIVE.has(row.status)) { buckets['Active']++; companies['Active'].push(entry); }
      else if (PIPELINE_PASSED.has(row.status)) { buckets['Passed']++; companies['Passed'].push(entry); }
      else if (PIPELINE_REJECTED.has(row.status)) { buckets['Rejected']++; companies['Rejected'].push(entry); }
      else if (PIPELINE_CLOSED.has(row.status)) { buckets['Decided to pass']++; companies['Decided to pass'].push(entry); }
    }
    const chartData = Object.entries(buckets)
      .filter(([, y]) => y > 0)
      .map(([x, y]) => ({ x, y })) as ChartDataType1[];
    this.dataService.setProgressChart(chartData);
    this.dataService.setProgressChartCompanies(companies);
  }

  public statusChartBuilder(): void {
    const statusChartData = this.chartDataSlicer();
    const statusCountMap = new Map<string, number>();
    const statusCompaniesMap = new Map<string, string[]>();
    for (const row of statusChartData) {
      const status = row.status.toString();
      statusCountMap.set(status, (statusCountMap.get(status) || 0) + 1);
      if (!statusCompaniesMap.has(status)) statusCompaniesMap.set(status, []);
      statusCompaniesMap.get(status)!.push(row.companyName);
    }
    const chartData = Array.from(statusCountMap.entries())
      .map(([x, y]) => ({ x, y }))
      .sort((a, b) => b.y - a.y) as ChartDataType1[];
    this.dataService.setStatusChart(chartData);
    this.dataService.setStatusChartCompanies(Object.fromEntries(statusCompaniesMap));
  }

  public marketChartBuilder(): void {
    const data = this.chartDataSlicer();
    const BUCKET_NAMES = ['Pending', 'Active', 'Passed', 'Rejected', 'Decided to pass'];
    const weekMap = new Map<string, Record<string, number>>();
    for (const row of data) {
      if (!row.applicationDate) continue;
      const d = new Date(row.applicationDate.toString());
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay() + 1);
      const key = weekStart.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      if (!weekMap.has(key)) {
        weekMap.set(key, { 'Pending': 0, 'Active': 0, 'Passed': 0, 'Rejected': 0, 'Decided to pass': 0 });
      }
      const week = weekMap.get(key)!;
      if (PIPELINE_PENDING.has(row.status)) week['Pending']++;
      else if (PIPELINE_ACTIVE.has(row.status)) week['Active']++;
      else if (PIPELINE_PASSED.has(row.status)) week['Passed']++;
      else if (PIPELINE_REJECTED.has(row.status)) week['Rejected']++;
      else if (PIPELINE_CLOSED.has(row.status)) week['Decided to pass']++;
    }
    const labels = Array.from(weekMap.keys()).sort((a, b) => {
      const parse = (s: string) => new Date(s.split(' ').reverse().join(' '));
      return parse(a).getTime() - parse(b).getTime();
    });
    const buckets: Record<string, number[]> = {};
    for (const b of BUCKET_NAMES) {
      buckets[b] = labels.map(w => weekMap.get(w)![b]);
    }
    this.dataService.setMarketChart({ labels, buckets });
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
