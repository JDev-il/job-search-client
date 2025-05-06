import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { NavBarLink } from '../../core/models/data.interface';
import { FormEnum } from '../../core/models/enum/utils.enum';
import { ITableDataRow } from '../../core/models/table.interface';
import { BaseDialogComponent } from '../../shared/base/dialog-base.component';
import { FormsService } from '../../shared/services/forms.service';
import { StateService } from '../../shared/services/state.service';
import { CentralHubComponent } from "./central-hub/central-hub.component";
@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    CentralHubComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent extends BaseDialogComponent {
  private isDataExists = signal(false);
  public cvCounter = signal<number>(0);
  public currentTabIndex = signal<number>(0);
  constructor(private stateService: StateService, private formService: FormsService, dialog: MatDialog) {
    super(dialog)
    effect(() => {
      const dataUser = this.stateService.dataUserResponse$;
      if (dataUser && dataUser.userId) {
        this.stateService.authorizedUserDataRequest().subscribe({
          next: (data: ITableDataRow[]) => {
            this.isDataExists.set(this.stateService.isDataExists());
            this.cvCounter.set(data.length);
          },
          error: () => throwError(() => console.error('Error with data rendering'))
        });
      }
      this.currentTabIndex.set(this.stateService.currentTabIndex());
    }, { allowSignalWrites: true });
  }

  public tabIndexSetter(link: NavBarLink) {
    this.stateService.currentTabIndex.set(link.index);
  }

  public addRow() {
    this.openDialog({ form: { formTitle: FormEnum.add, formType: this.formService.tableRowInit() } });
  }

  public get isData(): boolean {
    return this.isDataExists();
  }

}
