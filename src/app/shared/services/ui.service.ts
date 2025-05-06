import { Injectable, signal } from '@angular/core';
import { StatusEnum } from '../../core/models/enum/table-data.enum';
import { ITableDataRow } from '../../core/models/table.interface';

import { Observable, of, tap } from 'rxjs';
import { NavBarLink, TimeLine } from '../../core/models/data.interface';
import { ChartOptions, StateService } from './state.service';


export type ChartPoint = { x: number; y: number };

@Injectable({ providedIn: 'root' })
export class UIService {
  public cvProgressChartAnimation = signal<boolean>(true);
  public cvProgressAxes: { x: number; y: number }[] = [];
  constructor(private stateService: StateService) { }

  public get navBarLinks(): NavBarLink[] {
    return [
      { name: 'Dashboard', route: '', icon: 'dashboard', index: 0 },
      { name: 'Activity', route: 'activity', icon: 'view_list', index: 1 },
    ];
  }

  public getTimeLinesCategories(forceRefresh = false): Observable<TimeLine[]> {
    if (!forceRefresh && this.stateService.cvProgressTimeline().length > 0) {
      return of(this.stateService.cvProgressTimeline());
    }
    return this.stateService.getTimeLineList().pipe(
      tap((data) => this.stateService.cvProgressTimeline.set(data))
    );
  }

  public get timeLineCategories(): TimeLine[] {
    return this.stateService.cvProgressTimeline();
  }

  public progressChartInitializer(): ChartOptions {
    return <ChartOptions>{
      series: [{
        name: 'CV Progress',
        data: this.cvProgressAxes
      }] as ApexAxisChartSeries,
      chart: {
        height: "360px",
        width: "550px",
        type: "line",
        zoom: {
          allowMouseWheelZoom: false,
          type: 'x',
          autoScaleYaxis: true
        },
        toolbar: {
          show: true,
          autoSelected: 'zoom'
        },
        animations: {
          enabled: this.cvProgressChartAnimation()
        }
      } as ApexChart,
      xaxis: {
        type: 'datetime',
        range: 1000 * 60 * 180 * 24 * 90 // ← 3-month visible window by default
      } as ApexXAxis,
      yaxis: {
        forceNiceScale: true,
        title: {
          text: "CV Count",
        },
      } as ApexXAxis,
      stroke: {
        width: 3,
        curve: 'smooth',
        lineCap: 'round',
      } as ApexStroke,
      title: {
        text: "CV Sending Progress",
        align: "center",
        style: {
          fontSize: "18px",
          color: "#081226",
        },
      } as ApexTitleSubtitle,
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          colorStops: [
            [
              {
                offset: 15,
                color: '#FF6C80',
                opacity: 1
              },
              {
                offset: 75,
                color: '#F6B26B',
                opacity: 1
              },
            ]
          ]
        }
      } as ApexFill,
      markers: {
        size: 4,
        colors: ["#081226"],
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 7,
        },
      } as ApexMarkers
    }
  }

  public cvProgressDataInit(): void {
    const dateCountMap = new Map<string, number>();
    this.stateService.tableDataResponse$.forEach((pos, i) => {
      if (!pos.applicationDate) return;
      const dateToISOString = new Date(pos.applicationDate).toISOString().split('T')[0];
      dateCountMap.set(dateToISOString, i);
    });
    const sorted = Array.from(dateCountMap.entries()).sort(
      ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
    );
    const counts = sorted.map(([date], count) => ({
      x: new Date(date).getDate(),
      y: count + 1
    }));
    this.cvProgressAxes = counts;
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
}
