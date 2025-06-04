import { Injectable } from '@angular/core';
import { ChartType } from 'ng-apexcharts';
import { ChartData, IChartOptions } from '../../core/models/chart.interface';
import { ITableDataRow } from '../../core/models/table.interface';
import { StateService } from './state.service';

@Injectable({ providedIn: 'root' })
export class ChartsService {
  constructor(private stateService: StateService) { }

  public chartDataBuilder(): void {
    let data: ITableDataRow[] = [] as ITableDataRow[];
    if (this.stateService.daysFilter() === 0) {
      data = this.stateService.tableDataResponse$.slice();
    } else {
      data = this.stateService.globalFilteredData$.slice();
    }
    const dateCountMap = new Map<string, number>();
    for (const row of data) {
      const dateRaw = row.applicationDate!.toString();
      const dateKey = new Date(dateRaw).toLocaleString('en-US', {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric'
      });
      dateCountMap.set(dateKey, (dateCountMap.get(dateKey) || 0) + 1);
      this.stateService.companyNames.set(row.companyName, (dateCountMap.get(dateKey) || 0) + 1);
    }
    const chartData = Array.from(dateCountMap.entries())
      .map(([x, y]) => ({ x, y }))
      .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime()) as ChartData[];
    this.stateService.progressChart.set(chartData);
  }

  public progressChart(): IChartOptions {
    return {
      series: [
        {
          name: 'You sent ',
          data: this.stateService.progressChart() as ChartData[]
        }
      ] as ApexAxisChartSeries,
      chart: {
        height: 300,
        width: 640,
        type: "bar" as ChartType,
        stacked: true,
        stackType: 'normal',
        selection: {
          enabled: false
        },
        parentHeightOffset: 100,
        zoom: {
          enabled: true,
          type: 'x' as const,
          autoScaleYaxis: true,
          allowMouseWheelZoom: false,
        },
        toolbar: {
          show: true,
          autoSelected: 'pan',
          tools: {
            download: false,
            zoom: false,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          }
        },
        tooltip: {
          enabled: true,
          shared: false,
          followCursor: true,
          intersect: false,
          inverseOrder: false,
          hideEmptySeries: false,
          fillSeriesColor: false,
        } as ApexTooltip,
        animations: {
          dynamicAnimation: {
            enabled: true,
            speed: 220
          },
          speed: 800,
          enabled: true
        },
        dropShadow: {
          enabled: true,
          opacity: .3,
          color: "#081226",
          top: 5,
        }
      } as ApexChart,
      xaxis: {
        type: 'category',
        labels: {
          style: {
            fontSize: '10px'
          }
        },
        min: 2,
        tooltip: {
          enabled: true
        },
      } as ApexXAxis,
      yaxis: {
        crosshairs: {
          position: 'bottom',
        },
        title: {
          text: "CV Sent"
        },
        max: 10,
      } as ApexYAxis,
      title: {
        text: 'CV Sending Rate',
        align: 'center',
        style: {
          fontWeight: 300,
          fontSize: '18px',
          color: '#081226'
        }
      } as ApexTitleSubtitle,
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'vertical',
          colorStops: [
            [
              { offset: 15, color: '#FF6C80', opacity: 1 },
              { offset: 85, color: '#533E83', opacity: 1 }
            ]
          ]
        }
      } as ApexFill,
      markers: {
        size: 6,
        colors: ["#077AFF"],
        strokeWidth: 0,
        hover: {
          size: 8,
        },
        shape: 'sparkle'
      } as ApexMarkers,
    } as IChartOptions
  }
}
