import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, ElementRef, Input, signal, ViewChild } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartOptions } from '../../../shared/services/state.service';

import { ITableDataRow } from '../../../core/models/table.interface';
import { UIService } from '../../../shared/services/ui.service';
@Component({
  selector: 'app-progress-viewer',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './progress-viewer.component.html',
  styleUrl: './progress-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProgressViewerComponent {
  @ViewChild('') chart: ElementRef<ApexChart> = new ElementRef<ApexChart>({});
  @Input() positions = signal<ITableDataRow[]>([]);
  @Input() counter = signal<number>(0);
  @Input() isAnimationRequired?: boolean;
  public chartOptions!: ChartOptions;
  public categories: string[] = [];

  constructor(private cd: ChangeDetectorRef, private uiService: UIService) {
    this.uiService.getTimeLinesCategories().subscribe();
    effect(() => {
      this.uiService.cvProgressDataInit();
      if (this.uiService.cvProgressAxes.length > 0) {
        this.chartOptions.series = [
          {
            name: 'CVs Sent',
            data: this.uiService.cvProgressAxes
          }
        ];
        this.chartOptions.xaxis = {
          type: 'datetime',
        };
      }
      this.cd.markForCheck();
    });
  }

  ngOnInit(): void {
    this.uiService.cvProgressChartAnimation.update(() => this.positions().length > 0 ? true : false);
    this.chartOptions = this.uiService.progressChartInitializer();
  }
}
