import { ChangeDetectorRef, Component, effect, ViewEncapsulation } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexFill, ApexMarkers, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis, ChartType, NgApexchartsModule } from 'ng-apexcharts';
import { ChartDataType1, IChartOptions } from '../../../../core/models/chart.interface';
import { ChartsBaseComponent } from '../../../base/charts-base.component';
import { DataService } from '../../../services/data.service';
import { ChartsService } from './../../../services/charts.service';
import { UIService } from './../../../services/ui.service';

@Component({
    selector: 'app-market-chart',
    imports: [NgApexchartsModule],
    templateUrl: './market-chart.component.html',
    styleUrls: ['./market-chart.component.scss', '../../../style/charts.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MarketChartComponent extends ChartsBaseComponent {
  constructor(cd: ChangeDetectorRef, uiService: UIService, chartsService: ChartsService, dataService: DataService) {
    super(cd, uiService, chartsService, dataService);
    effect(() => {
      this.chartsService.marketChartBuilder();
      this.marketChartOptions.set(this.marketChart());
      this.cd.markForCheck();
    });
  }

  public marketChart(): IChartOptions {
    const data = this.dataService.marketChart() as ChartDataType1[];
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
        height: 300,
        type: 'area' as ChartType,
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
          hideEmptySeries: false,
          fillSeriesColor: false,
        } as ApexTooltip,
        animations: {
          dynamicAnimation: { enabled: true, speed: 220 },
          speed: 800,
          enabled: true
        },
        dropShadow: {
          enabled: true,
          opacity: .3,
          color: "#CC5A00",
          top: 5,
        }
      } as ApexChart,
      xaxis: {
        type: 'category',
        labels: { style: {} },
        tooltip: { enabled: true },
      } as ApexXAxis,
      yaxis: {
        crosshairs: { position: 'bottom' },
        title: { text: "CV Sent" },
        max: maxY,
      } as ApexYAxis,
      title: {
        text: 'Application Timeline',
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
              { offset: 0, color: '#FF8C42', opacity: 0.85 },
              { offset: 100, color: '#FF8C42', opacity: 0.05 }
            ]
          ]
        }
      } as ApexFill,
      stroke: {
        curve: 'smooth',
        width: 2,
        colors: ['#FF8C42']
      } as ApexStroke,
      markers: {
        size: 4,
        colors: ["#FF8C42"],
        strokeWidth: 0,
        hover: { size: 6 },
        shape: 'circle'
      } as ApexMarkers,
    } as IChartOptions
  }
}
