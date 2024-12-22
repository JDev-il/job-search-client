import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, effect, signal, ViewChild, ViewEncapsulation, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { combineLatest, debounceTime, fromEvent, map, tap } from 'rxjs';
import { BaseDialogComponent } from '../../shared/base/dialog-base.component';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { FormsService } from '../../shared/services/forms.service';
import { StateService } from '../../shared/services/state.service';
import { ITableDataResponse } from './../../core/models/table.interface';


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
    MatInputModule,
    CommonModule,
    SpinnerComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ActivityTableComponent extends BaseDialogComponent {
  // displayedColumns: string[] = ['status', 'company', 'position', 'application', 'note', 'hunch'];
  // dataSource: WritableSignal<ITableDataResponse[]> = signal<ITableDataResponse[]>([] as ITableDataResponse[]); // WritableSignal for reactive updates
  private newRow!: FormGroup;
  public displayedColumns: string[] = ['status', 'company', 'position', 'application', 'note', 'hunch', 'actions'];
  public dataSource = new MatTableDataSource([] as ITableDataResponse[]);
  public localSpinner: WritableSignal<boolean> = signal<boolean>(false);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<ITableDataResponse[]>;

  constructor(private formService: FormsService, private destroyRef: DestroyRef, private cd: ChangeDetectorRef, private stateService: StateService, dialog: MatDialog) {
    super(dialog);
    effect(() => {
      if (this.stateService.getDestroyedState()) {
        return;
      }
      const dataUser = this.stateService.dataUserResponse$;
      if (dataUser && dataUser.userId) {
        if (!this.stateService.tableDataResponse.length) {
          combineLatest({
            tableData: this.stateService.authorizedUserDataRequest()
          }).pipe(map(data => data.tableData))
            .subscribe((tableData) => {
              this.dataSource.sort = this.sort;
              if (tableData.length) {
                this.dataSource.data = tableData
                // this.dataSource(tableData);
              }
            })
        } else {
          // this.dataSource.set(this.stateService.tableDataResponse);
          this.dataSource.data = this.stateService.tableDataResponse;
        }
      }
    }, { allowSignalWrites: true });
    destroyRef.onDestroy(() => {
      this.stateService.markAsDestroyed();
      this.stateService.resetDestroyed();
    })
  }

  public applyFilter(event: KeyboardEvent) {
    fromEvent((event.target as HTMLInputElement), 'input')
      .pipe(
        tap(() => this.localSpinner.set(true)),
        debounceTime(600),
        map(s => (s.target as HTMLInputElement).value))
      .subscribe(res => {
        this.dataSource.filter = res;
        this.localSpinner.set(false);
      })
  }


  public addRow() {
    this.newRow = this.formService.tableRowInit();
    this.openDialog({ form: this.newRow });
    // this.stateService.addNewApplication().subscribe();
  }

  public removeRow(row: ITableDataResponse) {
    const indexOf = this.dataSource.data.indexOf(row);
    this.dataSource.data.splice(indexOf, 1);
    this.updateTable();
  }


  public get currentDate(): Date {
    return new Date();
  }

  private updateTable() {
    this.dataSource._updateChangeSubscription()
    this.table.renderRows();
  }
}
