import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, EffectRef, EnvironmentInjector, Input, runInInjectionContext, signal } from '@angular/core';
import {
  ApexChart,
  ApexFill,
  ApexGrid,
  ApexMarkers,
  ApexStroke,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexYAxis, NgApexchartsModule
} from 'ng-apexcharts';
import { IAxis } from '../../../core/models/data.interface';
import { ITableDataRow } from '../../../core/models/table.interface';
import { ChartPoint, UIService } from '../../services/ui.service';

export type ChartOptions = {
  series: {
    name: string,
    data: ChartPoint[]
  }[];
  chart: ApexChart;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  fill: ApexFill;
  markers: ApexMarkers;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class ChartComponent {
  private effectRef!: EffectRef;
  @Input() positions = signal<ITableDataRow[]>([]);
  @Input() counter = signal<number>(0);
  @Input() isAnimationRequired: boolean = false;
  @Input() isProgressDataExists: boolean = false;
  public chartReady = signal(false);
  public chartOptions: ChartOptions = {} as ChartOptions;
  public categories: string[] = [];
  public cvProgressChartAnimation = signal<boolean>(true);
  public cvProgressAxes: IAxis[] = [];


  constructor(private cd: ChangeDetectorRef, private uiService: UIService, private injector: EnvironmentInjector) {
    this.uiService.cvProgressChartAnimation.update(() => this.positions().length > 0 ? true : false);
  }
  ngOnDestroy(): void {
    this.effectRef?.destroy();
  }
  ngAfterViewInit() {
    runInInjectionContext(this.injector, () => {
      this.effectRef = effect(() => {
        const axes = this.uiService.cvProgressAxes;
        this.uiService.cvProgressAxesData();
        if (axes.length > 0) {
          this.chartOptions = {
            ...this.progressChartInitializer(),
            series: [{
              name: 'CVs Sent',
              data: axes
            }]
          };
          this.chartReady.set(true);
          this.cd.markForCheck();
        }
      }, { allowSignalWrites: true });
    });
  }

  public progressChartInitializer(): ChartOptions {
    return <ChartOptions>{
      series: [{
        name: '',
        data: this.cvProgressAxes,
      }] as ApexAxisChartSeries,
      chart: {
        height: "420px",
        width: "640px",
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
          text: "CV Count"
        }
      } as ApexYAxis,
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
    } as ChartOptions
  }

}
