import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, signal, ViewChild, WritableSignal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BaseDialogComponent } from '../../shared/base/dialog-base.component';
import { StateService } from '../../shared/services/state.service';
import { ITableRow } from './../../core/models/table.interface';


@Component({
  selector: 'app-activity-table',
  standalone: true,
  templateUrl: './activity-table.component.html',
  styleUrl: './activity-table.component.scss',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    CommonModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityTableComponent extends BaseDialogComponent {
  displayedColumns: string[] = ['status', 'company', 'position', 'application', 'note', 'hunch'];
  dataSource: WritableSignal<ITableRow[]> = signal<ITableRow[]>([] as ITableRow[]); // WritableSignal for reactive updates

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private cd: ChangeDetectorRef, private stateService: StateService, dialog: MatDialog) {
    super(dialog);
    effect(() => {

      const dataUser = this.stateService.dataUserResponse$;
      if (dataUser && dataUser.userId) {
        this.stateService.authorizedUserData().subscribe((tableData: ITableRow[]) => {
          this.dataSource.set(tableData)
        })
      }
    })
  }

  get currentDate(): Date {
    return new Date();
  }
}
