import { Injectable } from '@angular/core';
import { ChartDataType1 } from '../../core/models/chart.interface';
import { StatusEnum } from '../../core/models/enum/table-data.enum';
import { ITableDataRow } from '../../core/models/table.interface';
import { DataService } from './data.service';

const PIPELINE_PENDING = new Set<StatusEnum>([StatusEnum.AWAITING_RESPONSE, StatusEnum.REAPPLIED]);
const PIPELINE_ACTIVE = new Set<StatusEnum>([StatusEnum.HR_REACHED_BACK, StatusEnum.AWAITING_INTERVIEW, StatusEnum.INTERVIEW_SCHEDULED, StatusEnum.AWAITING_RESULTS, StatusEnum.AWAITING_DECISION]);
const PIPELINE_PASSED = new Set<StatusEnum>([StatusEnum.PASSED, StatusEnum.RECEIVED_CONTRACT]);
const PIPELINE_REJECTED = new Set<StatusEnum>([StatusEnum.REJECTED, StatusEnum.DID_NOT_PASS_HR, StatusEnum.PROBABLY_NOT]);
const PIPELINE_CLOSED = new Set<StatusEnum>([StatusEnum.DECIDED_TO_PASS, StatusEnum.LOW_SALARY, StatusEnum.ARCHIVED]);

export const STATUS_BUCKET_COLORS: Record<string, string> = {
  [StatusEnum.AWAITING_RESPONSE]: '#6B7280',
  [StatusEnum.REAPPLIED]: '#6B7280',
  [StatusEnum.HR_REACHED_BACK]: '#077AFF',
  [StatusEnum.AWAITING_INTERVIEW]: '#3B82F6',
  [StatusEnum.INTERVIEW_SCHEDULED]: '#2563EB',
  [StatusEnum.AWAITING_RESULTS]: '#1D4ED8',
  [StatusEnum.AWAITING_DECISION]: '#4B9FFF',
  [StatusEnum.PASSED]: '#00C49A',
  [StatusEnum.RECEIVED_CONTRACT]: '#059669',
  [StatusEnum.REJECTED]: '#EF4444',
  [StatusEnum.DID_NOT_PASS_HR]: '#DC2626',
  [StatusEnum.PROBABLY_NOT]: '#F87171',
  [StatusEnum.DECIDED_TO_PASS]: '#FF8C42',
  [StatusEnum.LOW_SALARY]: '#F97316',
  [StatusEnum.ARCHIVED]: '#94A3B8',
};

export const BUCKET_COLORS: Record<string, string> = {
  'Pending': STATUS_BUCKET_COLORS[StatusEnum.AWAITING_RESPONSE],
  'Active': STATUS_BUCKET_COLORS[StatusEnum.HR_REACHED_BACK],
  'Passed': STATUS_BUCKET_COLORS[StatusEnum.PASSED],
  'Rejected': STATUS_BUCKET_COLORS[StatusEnum.REJECTED],
  'Decided to pass': STATUS_BUCKET_COLORS[StatusEnum.DECIDED_TO_PASS],
};

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
    const weekCountMap = new Map<string, number>();
    for (const row of data) {
      if (!row.applicationDate) continue;
      const d = new Date(row.applicationDate.toString());
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay() + 1);
      const key = weekStart.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      weekCountMap.set(key, (weekCountMap.get(key) || 0) + 1);
    }
    const chartData = Array.from(weekCountMap.entries())
      .map(([x, y]) => ({ x, y }))
      .sort((a, b) => {
        const parse = (s: string) => new Date(s.split(' ').reverse().join(' '));
        return parse(a.x).getTime() - parse(b.x).getTime();
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
