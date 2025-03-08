import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { FormEnum } from '../../core/models/enum/utils.enum';
import { ITableDataRow } from '../../core/models/table.interface';
import { BaseDialogComponent } from '../../shared/base/dialog-base.component';
import { FormsService } from '../../shared/services/forms.service';
import { StateService } from '../../shared/services/state.service';
import { CentralHubComponent } from "./central-hub/central-hub.component";
import { SidebarComponent } from './sidebar/sidebar.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    SidebarComponent,
    CentralHubComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent extends BaseDialogComponent {
  // > link sidebar routes to desired endpoints / pages that will be loaded into DashboardComponent area ['Dashboard']
  private isDataExists = signal(false);
  public cvCounter = signal<number>(0);
  constructor(private stateService: StateService, private formService: FormsService, dialog: MatDialog) {
    super(dialog)
    effect(() => {
      this.stateService.tableDataCache$.subscribe({
        next: (data: ITableDataRow[]) => {
          this.isDataExists.set(this.stateService.isDataExists());
          this.cvCounter.set(data.length);
        },
        error: () => throwError(() => console.error('Error with data rendering'))
      });
    }, { allowSignalWrites: true });
  }

  public addRow() {
    this.openDialog({ form: { formTitle: FormEnum.add, formType: this.formService.tableRowInit() } });
  }

  public get isData(): boolean {
    return this.isDataExists();
  }

}
