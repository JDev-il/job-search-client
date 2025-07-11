import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, DestroyRef, effect, Renderer2, signal, ViewChild, ViewEncapsulation, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { debounceTime, fromEvent, map, Subject, takeUntil, tap, throwError } from 'rxjs';
import { PositionStackEnum } from '../../core/models/enum/table-data.enum';
import { FormEnum } from '../../core/models/enum/utils.enum';
import { BaseDialogComponent } from '../../shared/base/dialog-base.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { FaderDirective } from '../../shared/directives/fader.directive';
import { DataService } from '../../shared/services/data.service';
import { FormsService } from '../../shared/services/forms.service';
import { ITableDataRow } from './../../core/models/table.interface';
import { UIService } from './../../shared/services/ui.service';

@Component({
  selector: 'app-activity-table',
  standalone: true,
  templateUrl: './activity-table.component.html',
  styleUrl: './activity-table.component.scss',
  imports: [
    SpinnerComponent,
    FaderDirective,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    CommonModule,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityTableComponent extends BaseDialogComponent {
  private destroy$ = new Subject<void>();
  public positionStack: WritableSignal<PositionStackEnum[]> = signal<PositionStackEnum[]>([]);
  public selectedRows: WritableSignal<ITableDataRow[]> = signal<ITableDataRow[]>([]);
  public displayedColumns: string[] = [];
  public dataSource = new MatTableDataSource([] as ITableDataRow[]);
  public selection = new SelectionModel<ITableDataRow>(true, []);
  public localSpinner: WritableSignal<boolean> = signal<boolean>(false);
  public testingData = signal([] as ITableDataRow[]);

  public readonly isDataExistsComputed = computed(() => this.dataService.isDataExists());
  public readonly selectedCount = computed(() => this.selectedRows().length);
  public readonly isChecked = computed(() => this.selectedCount() > 0 && this.isAllSelected());
  public readonly isCheckedNotAll = computed(() => this.selectedCount() > 0 && this.selectedCount() < this.dataSource.data.length);
  public readonly isAllSelected = computed(() => this.selectedCount() === this.dataSource.data.length && this.dataSource.data.length > 0);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ITableDataRow[]>;

  constructor(
    private cd: ChangeDetectorRef,
    private formService: FormsService,
    private dataService: DataService,
    private uiService: UIService,
    private destroyRef: DestroyRef,
    private renderer: Renderer2,
    dialog: MatDialog) {
    super(dialog);
    this.displayedColumns = this.uiService.displayColumns;
    effect(() => {
      if (this.dataService.getDestroyedState()) {
        return;
      }
      const dataUser = this.dataService.dataUserResponse$;
      if (dataUser && dataUser.userId) {
        this.dataSource.sort = this.sort;
        if (this.dataService.isCachedRequest()) {
          this.dataService.authorizedUserDataRequest().subscribe({
            next: (data: ITableDataRow[]) => {
              this.dataSource.data = data as ITableDataRow[];
            },
            error: () => throwError(() => console.error('Error with data rendering'))
          })
        } else {
          this.dataSource.data = this.dataService.tableDataResponse();
        }
        if (this.verifyLastSortedData) {
          this.dataSource.data = this.dataService.lastSortedDataSource();
        }
      }
    }, { allowSignalWrites: true });
    this.destroyRef.onDestroy(() => {
      this.dataService.markAsDestroyed();
      this.dataService.resetDestroyed();
      this.destroy$.next();
      this.destroy$.complete();
    })
  }

  public rowColorSwitch(row: ITableDataRow): string {
    return this.uiService.colorSwitch(row);
  };

  public applyFilter(event: KeyboardEvent) {
    fromEvent(event.target as HTMLInputElement, 'input')
      .pipe(
        tap(() => this.localSpinner.set(true)),
        debounceTime(800),
        map((e: Event) => (e.target as HTMLInputElement).value.trim().toLowerCase()),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (value) => {
          this.dataSource.filter = value;
          this.localSpinner.set(false);
        }
      });
  }

  public toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.data);
    }
    this.syncSelectedRows();
    this.updateTable();
  }

  public onToggleRow(row: ITableDataRow): void {
    this.selection.toggle(row);
    this.syncSelectedRows();
  }

  public isSelected(row: ITableDataRow): boolean {
    return this.selection.isSelected(row);
  }

  public selectRow(row: ITableDataRow): void {
    const rows = [...this.selectedRows()];
    const selectedRowIndex = rows.findIndex(r => r.jobId === row.jobId);
    if (selectedRowIndex === -1) {
      rows.push(row);
    } else {
      rows.splice(selectedRowIndex, 1);
    }
    this.selectedRows.set(rows);
  }

  public addNewRow(): void {
    this.selection.clear();
    this.openDialog({ form: { formTitle: FormEnum.add, formType: this.formService.tableRowInit() } });
  }

  public editSelectedRow(row: ITableDataRow): void {
    this.selection.clear();
    const editForm = this.formService.editRowInit(row);
    this.openDialog({ form: { formTitle: FormEnum.edit, formType: editForm } });
  }

  public removeSelectedRows() {
    if (this.isAllSelected()) {
      this.dataSource = new MatTableDataSource([] as ITableDataRow[]);
    } else {
      const selectedJobIds = new Set(this.selectedRows().map((row) => row.jobId));
      const filteredDataSource = this.dataSource.data.filter(row => !selectedJobIds.has(row.jobId));
      this.dataService.setLastSortedDataSource(filteredDataSource);
      this.dataSource.data = filteredDataSource;
    }
    this.dataService.removeMultipleRows(this.selectedRows(), FormEnum.remove).subscribe();
    this.selectedRows.set([] as ITableDataRow[]);
    this.selection.clear();
    this.syncSelectedRows();
    this.updateTable();
    this.cd.detectChanges();
  }

  public sortData(sort: Sort): void {
    if (sort.direction === '') {
      return;
    }
    this.dataSource.data = this.uiService.sortDataSource(this.dataSource.data, sort);
    this.dataService.setLastSortedDataSource(this.dataSource.data);
  }

  public isHunchLength(length: number): boolean {
    return length > 250;
  }

  private get verifyLastSortedData(): boolean {
    return this.dataService.lastSortedDataSource() && this.dataService.lastSortedDataSource().length > 0;
  }

  private updateTable() {
    if (!this.dataSource.data.length) {
      this.dataService.setIsDataExists(false);
    }
    this.dataSource._updateChangeSubscription();
    this.table.renderRows();
  }

  private syncSelectedRows(): void {
    this.selectedRows.set([...this.selection.selected]);
  }
}
