import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { RouterOutlet } from '@angular/router';
import { throwError } from 'rxjs';
import { NavBarLink } from '../../core/models/data.interface';
import { FormEnum } from '../../core/models/enum/utils.enum';
import { ITableDataRow } from '../../core/models/table.interface';
import { BaseDialogComponent } from '../../shared/base/dialog-base.component';
import { FilterComponent } from '../../shared/components/filter/filter.component';
import { InnerNavigationComponent } from '../../shared/components/navigation/inner-navigation/inner-navigation.component';
import { FaderDirective } from '../../shared/directives/fader.directive';
import { DataService } from '../../shared/services/data.service';
import { FormsService } from '../../shared/services/forms.service';
import { UIService } from '../../shared/services/ui.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    FaderDirective,
    FilterComponent,
    InnerNavigationComponent,
    RouterOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.Eager
})
export class DashboardComponent extends BaseDialogComponent {
  private destroyRef = inject(DestroyRef);
  private localSortedTableDataResponse = signal<ITableDataRow[]>([]);

  public tabIndex = signal<number>(0);
  public currentTabIndex = signal<number>(0);
  public status = signal<string[]>([]);
  public progressDates = signal<string[]>([]);

  constructor(
    private dataService: DataService,
    private uiService: UIService,
    private formService: FormsService,
    dialog: MatDialog
  ) {
    super(dialog);
    effect(() => {
      const dataUser = this.dataService.dataUserResponse$;
      if (dataUser && dataUser.userId) {
        this.fetchUserData();
      }
      this.currentTabIndex.set(this.dataService.currentTabIndex());
      this.status.set(this.dataService.statusPreviewsList);
    });
  }

  public get innerLinks(): NavBarLink[] {
    return this.uiService.innerNavigationLinks;
  }

  public addRow() {
    this.openDialog({ form: { formTitle: FormEnum.add, formType: this.formService.tableRowInit() } });
  }

  public filterDataByDays(filterValue: number): void {
    const calcDate = this.uiService.calcDays(filterValue).getTime();
    let filtered: ITableDataRow[] = [];
    if (filterValue === 0) {
      filtered = this.localSortedTableDataResponse();
    } else {
      filtered = this.localSortedTableDataResponse().slice().filter(x => {
        return new Date(x.applicationDate!.toString()).getTime() >= calcDate;
      });
    }
    this.dataService.setDaysFilter(+filterValue);
    this.dataService.setGlobalFilteredData(filtered);
  }

  public filteredDays(): WritableSignal<number> {
    return this.dataService.getDaysFilter();
  }

  public get isData(): boolean {
    return this.dataService.isDataExists();
  }

  private fetchUserData(): void {
    this.dataService.authorizedUserDataRequest()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: ITableDataRow[]) => {
          const sortedData = data.slice().sort((a, b) =>
            new Date(b.applicationDate!.toString()).getTime() -
            new Date(a.applicationDate!.toString()).getTime()
          );
          this.localSortedTableDataResponse.set(sortedData);
        },
        error: () => throwError(() => console.error('Error with data rendering'))
      });
  }
}
