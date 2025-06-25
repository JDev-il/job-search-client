import { ChangeDetectionStrategy, Component, effect, signal, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { NavBarLink } from '../../core/models/data.interface';
import { FormEnum } from '../../core/models/enum/utils.enum';
import { ITableDataRow } from '../../core/models/table.interface';
import { BaseDialogComponent } from '../../shared/base/dialog-base.component';
import { ProgressChartComponent } from '../../shared/components/charts/progress-chart/progress-chart.component';
import { StatusChartComponent } from '../../shared/components/charts/status-chart/status-chart.component';
import { FilterComponent } from '../../shared/components/filter/filter.component';
import { FaderDirective } from '../../shared/directives/fader.directive';
import { FormsService } from '../../shared/services/forms.service';
import { StateService } from '../../shared/services/state.service';
import { UIService } from '../../shared/services/ui.service';
import { MarketChartComponent } from './../../shared/components/charts/market-chart/market-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    ProgressChartComponent,
    StatusChartComponent,
    MarketChartComponent,
    FaderDirective,
    FilterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent extends BaseDialogComponent {
  private localSortedTableDataResponse = signal<ITableDataRow[]>([]);
  private isDataExists = signal(false);
  public centralHubCvCounter = signal<number>(0);
  public tabIndex = signal<number>(0);
  public currentTabIndex = signal<number>(0);
  public status = signal<string[]>([]);
  public progressDates = signal<string[]>([]);

  constructor(private stateService: StateService, private uiService: UIService, private formService: FormsService, dialog: MatDialog) {
    super(dialog);
    effect(() => {
      const dataUser = this.stateService.dataUserResponse$;
      if (dataUser && dataUser.userId) {
        this.stateService.authorizedUserDataRequest().subscribe({
          next: (data: ITableDataRow[]) => {
            this.isDataExists.set(this.stateService.isDataExists());
            this.localSortedTableDataResponse.set(data.slice().sort((a: ITableDataRow, b: ITableDataRow) => new Date(b.applicationDate!.toString()).getTime() - new Date(a.applicationDate!.toString()).getTime()))
          },
          error: () => throwError(() => console.error('Error with data rendering'))
        });
      }
      this.currentTabIndex.set(this.stateService.currentTabIndex());
      this.status.set(this.stateService.statusPreviewsList);
    }, { allowSignalWrites: true });
  }

  public tabIndexSetter(link: NavBarLink) {
    this.stateService.currentTabIndex.set(link.index);
  }

  public addRow() {
    this.openDialog({ form: { formTitle: FormEnum.add, formType: this.formService.tableRowInit() } });
  }

  public filterDataByDays(filterValue: string): void {
    const numValue = +filterValue;
    const calcDate = this.uiService.calcDays(numValue).getTime();
    let filtered: ITableDataRow[] = [];
    if (numValue === 0) {
      filtered = this.localSortedTableDataResponse();
    } else {
      filtered = this.localSortedTableDataResponse().slice().filter(x => {
        return new Date(x.applicationDate!.toString()).getTime() >= calcDate;
      })
    }
    this.stateService.daysFilter.set(numValue);
    this.stateService.globalFilteredData$ = filtered;
  }

  public get filteredDays(): WritableSignal<number> {
    return this.stateService.daysFilter;
  }
  public get isData(): boolean {
    return this.isDataExists();
  }

}
