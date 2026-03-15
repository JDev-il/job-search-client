import { ChangeDetectorRef, Component, effect, ViewEncapsulation } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexFill, ApexMarkers, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartType, NgApexchartsModule } from 'ng-apexcharts';
import { ChartDataType1, IChartOptions } from '../../../../core/models/chart.interface';
import { ChartsBaseComponent } from '../../../base/charts-base.component';
import { DataService } from '../../../services/data.service';
import { ChartsService } from './../../../services/charts.service';
import { UIService } from './../../../services/ui.service';

@Component({
    selector: 'app-status-chart',
    imports: [NgApexchartsModule],
    templateUrl: './status-chart.component.html',
    styleUrls: ['./status-chart.component.scss', '../../../style/charts.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StatusChartComponent extends ChartsBaseComponent {
  constructor(cd: ChangeDetectorRef, uiService: UIService, chartsService: ChartsService, dataService: DataService) {
    super(cd, uiService, chartsService, dataService);
    effect(() => {
      this.chartsService.statusChartBuilder();
      this.statusChartOptions.set(this.statusChart());
    })
  }

  public statusChart(): IChartOptions {
    const data = this.dataService.statusChart() as ChartDataType1[];
    const maxY = data.length ? Math.max(...data.map(d => d.y)) + 1 : 10;
    return {
      series: [
        {
          name: 'Applications',
          data
        }
      ] as ApexAxisChartSeries,
      chart: {
        width: '100%',
        height: 340,
        type: 'bar' as ChartType,
        selection: {
          enabled: false
        },
        zoom: {
          enabled: true,
          type: 'x' as const,
          autoScaleYaxis: true,
          allowMouseWheelZoom: false,
        },
        toolbar: {
          show: true,
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
          color: "#006B54",
          top: 5,
        }
      } as ApexChart,
      xaxis: {
        type: 'category',
        labels: {
          style: {}
        },
        tooltip: {
          enabled: true
        },
      } as ApexXAxis,
      yaxis: {
        crosshairs: {
          position: 'bottom',
        },
        title: {
          text: "Applications"
        },
        max: maxY,
      } as ApexYAxis,
      title: {
        text: 'Status Distribution',
        align: 'center',
        style: {}
      } as ApexTitleSubtitle,
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'vertical',
          colorStops: [
            [
              { offset: 0, color: '#00C49A', opacity: 1 },
              { offset: 100, color: '#006B54', opacity: 1 }
            ]
          ]
        }
      } as ApexFill,
      markers: {
        size: 6,
        colors: ["#00C49A"],
        strokeWidth: 0,
        hover: { size: 8 },
        shape: 'sparkle'
      } as ApexMarkers,
    } as IChartOptions
  }
}
