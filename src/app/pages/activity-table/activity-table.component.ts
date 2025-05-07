import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, Renderer2, signal, ViewChild, ViewEncapsulation, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { debounceTime, fromEvent, map, Subject, takeUntil, tap, throwError } from 'rxjs';
import { PositionStackEnum } from '../../core/models/enum/table-data.enum';
import { FormEnum } from '../../core/models/enum/utils.enum';
import { BaseDialogComponent } from '../../shared/base/dialog-base.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { FaderDirective } from '../../shared/directives/fader.directive';
import { FormsService } from '../../shared/services/forms.service';
import { StateService } from '../../shared/services/state.service';
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
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ITableDataRow[]>;

  constructor(private formService: FormsService, private stateService: StateService, private uiService: UIService, private destroyRef: DestroyRef, private renderer: Renderer2, dialog: MatDialog) {
    super(dialog);
    this.displayedColumns = this.stateService.displayColumns;
    effect(() => {
      if (this.stateService.getDestroyedState()) {
        return;
      }
      const dataUser = this.stateService.dataUserResponse$;
      if (dataUser && dataUser.userId) {
        if (this.stateService.isCachedRequest()) {
          this.dataSource.sort = this.sort;
          this.stateService.authorizedUserDataRequest().subscribe({
            next: (data: ITableDataRow[]) => {
              this.dataSource.data = data as ITableDataRow[];
            },
            error: () => throwError(() => console.error('Error with data rendering'))
          })
        } else {
          this.dataSource.data = this.stateService.tableDataResponse$
        }
      }
    }, { allowSignalWrites: true });
    this.destroyRef.onDestroy(() => {
      this.stateService.markAsDestroyed();
      this.stateService.resetDestroyed();
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
      const filteredDataSource = [...this.dataSource.data].filter((row) => !selectedJobIds.has(row.jobId));
      this.dataSource.data = filteredDataSource;
    }
    this.stateService.removeMultipleRows(this.selectedRows(), FormEnum.remove).subscribe();
    this.selectedRows.set([] as ITableDataRow[]);
    this.selection.clear();
    this.syncSelectedRows();
    this.updateTable();
  }

  public isEnoughLength(length: number): boolean {
    return length > 250;
  }

  public get isPositions(): boolean {
    return !!this.positionStack().length;
  }

  public get isDataExists(): boolean {
    return this.stateService.isDataExists();
  }

  private updateTable() {
    if (!this.dataSource.data.length) {
      this.stateService.isDataExists.set(false);
    }
    this.dataSource._updateChangeSubscription();
    this.table.renderRows();
  }
  private syncSelectedRows(): void {
    this.selectedRows.set([...this.selection.selected]);
  }
}
