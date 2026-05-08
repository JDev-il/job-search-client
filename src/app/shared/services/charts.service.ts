import { Injectable } from '@angular/core';
import { ChartDataType1 } from '../../core/models/chart.interface';
import { IFollowUpStatRate, IFollowUpStats, TBUCKET_NAMES } from '../../core/models/data.interface';
import { FollowUpEntry, JobSearchFollowUpCircles } from '../../core/models/job-search.interface';
import { ITableDataRow } from '../../core/models/table.interface';
import { BUCKET_STRUCTURE, PIPELINE_ACTIVE, PIPELINE_PASSED, PIPELINE_PENDING, PIPELINE_REJECTED } from '../constants/charts';
import { FOLLOWUP_MAX, SUBMITTED_MAX } from '../constants/limitation-values';
import { TUrgency } from './../../core/models/data.interface';
import { DataService } from './data.service';

@Injectable({ providedIn: 'root' })
export class ChartsService {

  constructor(private dataService: DataService) { }

  public progressChartBuilder(): void {
    const chartData = this.chartDataSlicer();
    const buckets: Record<string, number> = {};
    const statusCounts: Record<string, number> = {};
    const companies: Record<string, { name: string; status: string }[]> = {};
    for (const { name, statuses } of BUCKET_STRUCTURE) {
      buckets[name] = 0;
      companies[name] = [];
      for (const status of statuses) {
        statusCounts[status] = 0;
      }
    }
    for (const row of chartData) {
      const bucket = BUCKET_STRUCTURE.find(b => b.statuses.includes(row.status));
      if (!bucket) continue;
      buckets[bucket.name]++;
      statusCounts[row.status]++;
      companies[bucket.name].push({ name: row.companyName, status: row.status });
    }
    const bucketData = BUCKET_STRUCTURE
      .map(({ name }) => ({ x: name, y: buckets[name] }))
      .filter(d => d.y > 0) as ChartDataType1[];
    const statusData: ChartDataType1[] = [];
    for (const bucketStatuses of BUCKET_STRUCTURE) {
      for (const status of bucketStatuses.statuses) {
        if (statusCounts[status] > 0) statusData.push({ x: status, y: statusCounts[status] });
      }
    }
    this.dataService.setProgressChart(bucketData);
    this.dataService.setProgressChartStatuses(statusData);
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
    const rowData = this.chartDataSlicer();
    const BUCKET_NAMES: TBUCKET_NAMES[] = ['Pending', 'Active', 'Passed', 'Rejected', 'Uncertain'];
    const weekMap = new Map<string, Record<string, number>>();
    for (const row of rowData) {
      if (!row.applicationDate) continue;
      const d = new Date(row.applicationDate.toString());
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay() + 1);
      const key = weekStart.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      if (!weekMap.has(key)) {
        weekMap.set(key, { 'Pending': 0, 'Active': 0, 'Passed': 0, 'Rejected': 0 });
      }
      const week = weekMap.get(key)!;
      if (PIPELINE_PENDING.has(row.status)) week['Pending']++;
      else if (PIPELINE_ACTIVE.has(row.status)) week['Active']++;
      else if (PIPELINE_PASSED.has(row.status)) week['Passed']++;
      else if (PIPELINE_REJECTED.has(row.status)) week['Rejected']++;
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

  public followUpDataBuilder(): void {
    const tableData = this.dataService.tableDataResponse();
    const entries = this.buildEntries(tableData);
    const counts = this.buildCounts(entries);
    const responseRate = this.calcResponseRate(tableData);
    this.dataService.setFollowUpData({ entries, counts, responseRate });
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

  private buildEntries(tableData: ITableDataRow[]): FollowUpEntry[] {
    const today = Date.now();
    return tableData
      .filter(row => PIPELINE_PENDING.has(row.status) || PIPELINE_ACTIVE.has(row.status))
      .map(row => {
        const daysElapsed = row.applicationDate
          ? Math.floor((today - new Date(row.applicationDate.toString()).getTime()) / 86400000)
          : 0;
        const urgency: TUrgency =
          daysElapsed <= SUBMITTED_MAX ? 'submitted' :
            daysElapsed <= FOLLOWUP_MAX ? 'followup' : 'overdue';
        return { companyName: row.companyName, status: row.status, daysElapsed, urgency };
      }).sort((a, b) => b.daysElapsed - a.daysElapsed);
  }

  private buildCounts(entries: FollowUpEntry[]): JobSearchFollowUpCircles {
    return {
      submitted: entries.filter(e => e.urgency === 'submitted').length,
      followup: entries.filter(e => e.urgency === 'followup').length,
      overdue: entries.filter(e => e.urgency === 'overdue').length,
    };
  }

  private calcResponseRate(tableData: ITableDataRow[]): IFollowUpStats | null {
    if (!tableData.length) return null;
    const employerEngaged = tableData.filter(row =>
      PIPELINE_ACTIVE.has(row.status) ||
      PIPELINE_PASSED.has(row.status) ||
      PIPELINE_REJECTED.has(row.status)
    );
    const pipelineApplications = employerEngaged.length + tableData.filter(row => PIPELINE_PENDING.has(row.status)).length;
    const closedApps = tableData.filter(row => PIPELINE_PASSED.has(row.status) || PIPELINE_REJECTED.has(row.status)).length;
    const passedApps = tableData.filter((row) => PIPELINE_PASSED.has(row.status)).length;

    const passRate: IFollowUpStatRate | null = closedApps
      ? { value: this.calcPercentageRate(passedApps, closedApps), numerator: passedApps, denominator: closedApps }
      : null;
    const responseRate: IFollowUpStatRate | null = pipelineApplications
      ? { value: this.calcPercentageRate(employerEngaged.length, pipelineApplications), numerator: employerEngaged.length, denominator: pipelineApplications }
      : null;
    return { passRate, responseRate };
  }

  private calcPercentageRate(numerator: number, denominator: number): number {
    return Math.round(numerator / denominator * 100);
  }
}
