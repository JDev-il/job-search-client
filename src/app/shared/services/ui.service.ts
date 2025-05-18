
import { Injectable, inject, signal } from '@angular/core';
import { StatusEnum } from '../../core/models/enum/table-data.enum';
import { ITableDataRow } from '../../core/models/table.interface';

import { ChartTimeLine, NavBarLink } from '../../core/models/data.interface';
import { StateService } from './state.service';

import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { ChartData } from '../../core/models/chart.interface';

@Injectable({ providedIn: 'root' })
export class UIService {
  private platformId = inject(PLATFORM_ID);

  public cvProgressChartAnimation = signal<boolean>(true);
  public cvProgressAxes: { x: number; y: number }[] = [];
  constructor(private stateService: StateService) { }

  public get navBarLinks(): NavBarLink[] {
    return [
      { name: 'Dashboard', route: '', icon: 'dashboard', index: 0 },
      { name: 'Activity Table', route: 'activity', icon: 'view_list', index: 1 },
    ];
  }

  public chartDataBuilder(): ChartData[] {
    let data: ITableDataRow[] = [];
    if (this.stateService.daysFilter() === 0) {
      data = this.stateService.tableDataResponse$.slice();
    } else {
      data = this.stateService.globalFilteredData$.slice();
    }
    const dateCountMap = new Map<string, number>();
    for (const row of data) {
      const dateRaw = row.applicationDate;
      if (!dateRaw) continue;
      const dateKey = new Date(dateRaw).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      });
      dateCountMap.set(dateKey, (dateCountMap.get(dateKey) || 0) + 1);
    }
    const chartData = Array.from(dateCountMap.entries())
      .map(([x, y]) => ({ x, y }))
      .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime());
    return chartData;
  }

  public calcDays(days: number): Date {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() - days);
    return newDate;
  }

  public compareAndSort(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  public get timeLineCategories(): ChartTimeLine[] {
    return this.stateService.cvProgressTimeline();
  }

  public colorSwitch(row: ITableDataRow): string {
    switch (row.status) {
      case StatusEnum.AWAITING_RESPONSE:
        return "awaiting-response";
      case StatusEnum.HR_REACHED_BACK:
        return "hr-reached-back";
      case StatusEnum.AWAITING_DECISION:
        return "awaiting-decision";
      case StatusEnum.DECIDED_TO_PASS:
        return "decided-to-pass";
      case StatusEnum.LOW_SALARY:
        return "below-expectation";
      case StatusEnum.DID_NOT_PASS_HR:
        return "did-not-pass-hr";
      case StatusEnum.AWAITING_INTERVIEW:
        return "awaiting-interview";
      case StatusEnum.INTERVIEW_SCHEDULED:
        return "interview-scheduled";
      case StatusEnum.AWAITING_RESULTS:
        return "awaiting-results";
      case StatusEnum.REJECTED:
        return "rejected";
      case StatusEnum.PASSED:
        return "passed";
      case StatusEnum.PROBABLY_NOT:
        return "probably-not";
      case StatusEnum.REAPPLIED:
        return "reapplied";
      case StatusEnum.ARCHIVED:
        return "archived";
      case StatusEnum.RECEIVED_CONTRACT:
        return "received-contract";
      default:
        return '';
    }
  }

  public isMobile(): boolean {
    return isPlatformBrowser(this.platformId) &&
      /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  }

  public isWebView(): boolean {
    const ua = navigator.userAgent || '';
    return /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(ua) || ua.includes('wv');
  }
}
