import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, signal, ViewChild, ViewEncapsulation, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { combineLatest, debounceTime, fromEvent, map, Subject, takeUntil, tap } from 'rxjs';
import { FormEnum } from '../../core/models/enum/utils.enum';
import { BaseDialogComponent } from '../../shared/base/dialog-base.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { FormsService } from '../../shared/services/forms.service';
import { StateService } from '../../shared/services/state.service';
import { ITableDataResponse, ITableRow } from './../../core/models/table.interface';

@Component({
  selector: 'app-activity-table',
  standalone: true,
  templateUrl: './activity-table.component.html',
  styleUrl: './activity-table.component.scss',
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    CommonModule,
    SpinnerComponent
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityTableComponent extends BaseDialogComponent {
  private inputDestroy$ = new Subject<void>();
  public selectedRows: WritableSignal<ITableDataResponse[]> = signal<ITableDataResponse[]>([]);
  public displayedColumns: string[] = ['select', 'status', 'company', 'position', 'application', 'note', 'hunch', 'actions'];
  public dataSource = new MatTableDataSource([] as ITableDataResponse[]);
  public selection = new SelectionModel<ITableDataResponse>(true, []);
  public localSpinner: WritableSignal<boolean> = signal<boolean>(false);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ITableDataResponse[]>;

  constructor(private formService: FormsService, private destroyRef: DestroyRef, private stateService: StateService, dialog: MatDialog) {
    super(dialog);
    effect(() => {
      if (this.stateService.getDestroyedState()) {
        return;
      }
      const dataUser = this.stateService.dataUserResponse$;
      if (dataUser && dataUser.userId) {
        combineLatest({
          tableData: this.stateService.authorizedUserDataRequest(),
        })
          .pipe(
            map((data) => data.tableData),
            tap(data => this.dataSource.data = data)
          )
          .subscribe((tableData) => {
            console.log(this.dataSource.data);
            if (tableData.length > 0) {
              this.dataSource.sort = this.sort;
              this.dataSource.data = tableData;
            }
          })
      }
    }, { allowSignalWrites: true });
    this.destroyRef.onDestroy(() => {
      this.stateService.markAsDestroyed();
      this.stateService.resetDestroyed();
      this.inputDestroy$.next();
      this.inputDestroy$.complete();
    })
  }

  public applyFilter(event: KeyboardEvent) {
    fromEvent(event.target as HTMLInputElement, 'input')
      .pipe(
        tap(() => this.localSpinner.set(true)),
        debounceTime(800),
        map((e: Event) => (e.target as HTMLInputElement).value.trim().toLowerCase()),
        takeUntil(this.inputDestroy$)
      )
      .subscribe({
        next: (value) => {
          this.dataSource.filter = value;
          this.localSpinner.set(false);
        }
      });
  }

  public get isChecked(): boolean {
    return this.selection.hasValue() && this.isAllSelected();
  }
  public get isCheckedNotAll(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected > 0 && numSelected < numRows;
  }

  public get currentDate(): Date {
    return new Date();
  }

  public isAllSelected(): boolean {
    const selectedRows = this.selection.selected.length;
    const totalRows = this.dataSource.data.length;
    return selectedRows === totalRows;
  }

  public toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.data);
    }
    this.syncSelectedRows();
  }

  public onToggleRow(row: ITableDataResponse): void {
    this.selection.toggle(row);
    this.syncSelectedRows();
  }

  public isSelected(row: ITableDataResponse): boolean {
    return this.selection.isSelected(row);
  }

  public selectRow(row: ITableDataResponse): void {
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
    this.openDialog({ form: { formTitle: FormEnum.addRow, formType: this.formService.tableRowInit() } });
  }

  public removeSingleRow(row: ITableDataResponse): void {
    const localDataSource = this.dataSource.data.filter((r) => r.jobId !== row.jobId);
    this.selection.deselect(row);
    this.dataSource.data = localDataSource;
    this.stateService.removeApplication(row, FormEnum.removeRow).subscribe();
    this.updateTable();
  }

  public removeSelectedRows() {
    if (this.isAllSelected()) {
      this.dataSource = new MatTableDataSource([] as ITableDataResponse[]);
    } else {
      const selectedJobIds = new Set(this.selectedRows().map((row) => row.jobId));
      this.dataSource.data = this.dataSource.data.filter((row) => !selectedJobIds.has(row.jobId));
    }
    this.selectedRows.set([] as ITableDataResponse[]);
    this.selection.clear();
    this.syncSelectedRows();
    this.updateTable();
  }

  public editSelectedRow(row: ITableRow): void {
    this.stateService.addEditApplication(row, FormEnum.editRow);
  }

  private updateTable() {
    this.dataSource._updateChangeSubscription();
    this.table.renderRows();
  }
  private syncSelectedRows(): void {
    this.selectedRows.set([...this.selection.selected]);
  }
}
