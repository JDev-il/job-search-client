import { ChangeDetectionStrategy, Component, effect, EventEmitter, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { throwError } from 'rxjs';
import { NavBarLink } from '../../core/models/data.interface';
import { FormEnum } from '../../core/models/enum/utils.enum';
import { ITableDataRow } from '../../core/models/table.interface';
import { BaseDialogComponent } from '../../shared/base/dialog-base.component';
import { FaderDirective } from '../../shared/directives/fader.directive';
import { FormsService } from '../../shared/services/forms.service';
import { StateService } from '../../shared/services/state.service';
import { CvCounterComponent } from './cv-counter/cv-counter.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    CvCounterComponent,
    FaderDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent extends BaseDialogComponent {
  genericEmitter = new EventEmitter<void>();
  private isDataExists = signal(false);
  public centralHubCvCounter = signal<number>(0);
  public tabIndex = signal<number>(0);
  public cvCounter = signal<number>(0);
  public currentTabIndex = signal<number>(0);

  public status = signal<string[]>([]);
  public progressData = signal<ITableDataRow[]>([]);
  public progressDates = signal<string[]>([]);


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
      this.status.set(this.stateService.statusPreviewsList);
      this.progressData.set(this.stateService.tableDataResponse$);
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
