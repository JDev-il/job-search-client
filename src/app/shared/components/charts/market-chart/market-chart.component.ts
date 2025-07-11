import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartsBaseComponent } from '../../../base/charts-base.component';
import { DataService } from '../../../services/data.service';
import { ChartsService } from './../../../services/charts.service';
import { UIService } from './../../../services/ui.service';

@Component({
  selector: 'app-market-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './market-chart.component.html',
  styleUrls: ['./market-chart.component.scss', '../../../style/charts.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MarketChartComponent extends ChartsBaseComponent {
  constructor(cd: ChangeDetectorRef, uiService: UIService, chartsService: ChartsService, dataService: DataService) {
    super(cd, uiService, chartsService, dataService);
  }
}
