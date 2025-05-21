import { Component, computed, Input, signal } from '@angular/core';
import { ApexChart, ApexFill, ApexMarkers, ApexStroke, ApexTitleSubtitle, ChartType, NgApexchartsModule } from 'ng-apexcharts';
import { ChartData } from '../../../../core/models/chart.interface';

@Component({
  selector: 'app-progress-chart',
  standalone: true,
  imports: [
    NgApexchartsModule,
  ],
  templateUrl: './progress-chart.component.html',
  styleUrl: './progress-chart.component.scss'
})
export class ProgressChartComponent {
  @Input() incomingChartSeriesDate = signal<ChartData[]>([]);
  public chartOptions = computed(() => ({
    series: [
      {
        name: 'Sent',
        data: this.incomingChartSeriesDate()
      }
    ],
    chart: {
      //! Add labels with company names inside
      height: 360,
      width: 550,
      type: "line" as ChartType,
      zoom: {
        type: "xy" as const,
        allowMouseWheelZoom: false,
        zoomedArea: {
          fill: { color: '#081226' }
        }
      },
      toolbar: {
        show: true,
        tools: {
          reset: true,
          zoomout: true
        },
      },
      animations: {
        dynamicAnimation: {
          enabled: true,
          speed: 220
        },
        speed: 800,
        enabled: true
      },
      dropShadow: { opacity: .6, color: "#081226" },
    } as ApexChart,
    stroke: {
      width: 2,
    } as ApexStroke,
    yAxis: {
      forceNiceScale: true,
    } as ApexYAxis,
    xAxis: {
      forceNiceScale: true,
      labels: {
        offsetX: 2,
        offsetY: 5,
        style: {
          fontSize: '10px'
        }
      },
      min: 6
    } as ApexXAxis,
    title: {
      text: 'Resume Sending Rate',
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
        type: 'horizontal',
        shadeIntensity: 0.5,
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        colorStops: [
          [
            { offset: 15, color: '#FF6C80', opacity: 1 },
            { offset: 85, color: '#533E83', opacity: 1 }
          ]
        ]
      }
    } as ApexFill,
    markers: {
      size: 5,
      colors: ['#081226'],
      strokeColors: '#fff',
      strokeWidth: 1,
      hover: {
        size: 8,
      }
    } as ApexMarkers
  }));
}
