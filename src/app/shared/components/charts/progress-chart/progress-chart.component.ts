import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, ViewEncapsulation } from '@angular/core';
import { ChartType, NgApexchartsModule } from 'ng-apexcharts';
import { ChartsBaseComponent } from '../../../base/charts-base.component';

import { ChartDataType1, IChartOptions } from '../../../../core/models/chart.interface';
import { DataService } from '../../../services/data.service';
import { UIService } from '../../../services/ui.service';
import { ChartsService } from './../../../services/charts.service';

@Component({
  selector: 'app-progress-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './progress-chart.component.html',
  styleUrls: ['./progress-chart.component.scss', '../../../style/charts.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ProgressChartComponent extends ChartsBaseComponent {
  constructor(cd: ChangeDetectorRef, uiService: UIService, chartsService: ChartsService, dataService: DataService) {
    super(cd, uiService, chartsService, dataService);
    effect(() => {
      this.chartsService.progressChartBuilder();
      this.progressChartOptions.set(this.progressChart());
      this.cd.markForCheck();
    }, { allowSignalWrites: true })
  }

  public progressChart(): IChartOptions {
    return {
      series: [
        {
          name: 'Sent',
          data: this.dataService.progressChart() as ChartDataType1[]
        }
      ] as ApexAxisChartSeries,
      chart: {
        width: 640,
        type: "bar" as ChartType,
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
            // fontSize: '10px'
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
          // fontWeight: 300,
          // fontSize: '18px',
          // color: '#081226'
        }
      } as ApexTitleSubtitle,
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'vertical',
          colorStops: [
            [
              // { offset: 15, color: '#FF6C80', opacity: 1 },
              // { offset: 0, color: '#533E83', opacity: 1 }
              { offset: 0, color: '#2C2043', opacity: 1 }
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
