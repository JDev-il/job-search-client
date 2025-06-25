import { ChangeDetectorRef, Component, effect, ViewEncapsulation } from '@angular/core';
import { ChartType, NgApexchartsModule } from 'ng-apexcharts';
import { IChartOptions } from '../../../../core/models/chart.interface';
import { ChartsBaseComponent } from '../../../base/charts-base.component';
import { StateService } from '../../../services/state.service';
import { ChartsService } from './../../../services/charts.service';
import { UIService } from './../../../services/ui.service';

@Component({
  selector: 'app-status-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './status-chart.component.html',
  styleUrls: ['./status-chart.component.scss', '../../../style/charts.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StatusChartComponent extends ChartsBaseComponent {
  constructor(cd: ChangeDetectorRef, uiService: UIService, chartsService: ChartsService, stateService: StateService) {
    super(cd, uiService, chartsService, stateService);
    effect(() => {
      this.chartsService.statusChartBuilder();
      this.statusChartOptions.set(this.statusChart());
    }, { allowSignalWrites: true })
  }

  public statusChart(): IChartOptions {
    return {
      series: [
        {
          name: 'Sent',
          data: this.stateService.statusChart()
        }
      ] as ApexAxisChartSeries,
      chart: {
        type: 'donut' as ChartType,
        selection: {
          enabled: false
        },
        parentHeightOffset: 100,
        zoom: {
          enabled: true,
          type: 'xy' as const,
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
          color: "#081226",
          top: 5,
        }
      } as ApexChart,
      xaxis: {
        type: 'category',
        categories: this.stateService.statusChart().map(row => row.x),
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
          text: "Curent Status"
        },
        max: 10,
      } as ApexYAxis,
      title: {
        text: 'Statuses',
        align: 'center',
        style: {
          // fontWeight: 300,
          // fontSize: '18px',
          // color: '#081226'
        }
      } as ApexTitleSubtitle,
      fill: {
        type: '',
        // gradient: {
        //   shade: 'dark',
        //   type: '',
        //   colorStops: [
        //     [
        //       // { offset: 15, color: '#FF6C80', opacity: 1 },
        //       // { offset: 0, color: '#533E83', opacity: 1 }
        //     ]
        //   ]
        // }
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
