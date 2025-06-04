
import { Injectable, inject, signal } from '@angular/core';
import { FilteringColumnNamesEnum, StatusEnum } from '../../core/models/enum/table-data.enum';
import { ITableDataRow, TColNames } from '../../core/models/table.interface';

import { ChartTimeLine, NavBarLink } from '../../core/models/data.interface';
import { StateService } from './state.service';

import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Sort } from '@angular/material/sort';

export interface MapCount {
  x: string,
  y: number
}
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

  public get displayColumns(): TColNames[] {
    return ['select', 'status', 'company', 'position', 'application', 'hunch', 'note'];
  }

  public get timeLineCategories(): ChartTimeLine[] {
    return this.stateService.cvProgressTimeline();
  }

  public get chartReady(): boolean {
    return !!this.stateService.progressChart().length;
  }

  public calcDays(days: number): Date {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() - days);
    return newDate;
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

  public sortDataSource(source: ITableDataRow[], sort: Sort): ITableDataRow[] {
    const filteringNames = FilteringColumnNamesEnum
    const data = source.slice();
    const sortedData = data.sort((a: ITableDataRow, b: ITableDataRow) => {
      switch (sort.active) {
        case filteringNames.status:
          return this.stateService.compareAndSortData(a.status, b.status, sort.direction === 'asc');
        case filteringNames.application:
          return this.stateService.compareAndSortData(new Date(a.applicationDate!.toString()).toISOString(), new Date(b.applicationDate!.toString()).toISOString(), sort.direction === 'asc');
        case filteringNames.position:
          return this.stateService.compareAndSortData(a.positionType, b.positionType, sort.direction === 'asc');
        case filteringNames.company:
          return (this.stateService.compareAndSortData(a.companyName, b.companyName, sort.direction === 'asc')) || this.stateService.compareAndSortData(a.companyLocation, b.companyLocation, sort.direction === 'asc');
        default:
          return 0;
      }
    }) as ITableDataRow[];
    return sortedData;
  }
}
