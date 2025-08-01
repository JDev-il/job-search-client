import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, Inject, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Country } from '../../../core/models/data.interface';
import { FormDialog, GenericDialogType } from '../../../core/models/dialog.interface';
import { NotificationsStatusEnum } from '../../../core/models/enum/messages.enum';
import { ContinentsEnum, FormEnum } from '../../../core/models/enum/utils.enum';
import { AuthService } from '../../../core/services/auth.service';
import { AddRowComponent } from '../../components/forms/add-row/add-row.component';
import { EditRowComponent } from '../../components/forms/edit-row/edit-row.component';
import { FirstToUpperCasePipe } from '../../pipes/custom-upper-case.pipe';
import { DataService } from '../../services/data.service';
import { RoutingService } from '../../services/routing.service';
import { TableDataFormRow } from './../../../core/models/forms.interface';

@Component({
  selector: 'app-generic-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, AddRowComponent, EditRowComponent, FirstToUpperCasePipe],
  templateUrl: './generic-dialog.component.html',
  styleUrl: './generic-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericDialogComponent {
  public dataType: WritableSignal<GenericDialogType> = signal<GenericDialogType>({});
  public notifyText = NotificationsStatusEnum;
  public countriesList: WritableSignal<Country[]> = signal([] as Country[]);
  public currentContinent!: ContinentsEnum;
  public editFormSnapshot!: TableDataFormRow;
  public formEnum = FormEnum;
  constructor(
    private dialogRef: MatDialogRef<GenericDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GenericDialogType,
    private dataService: DataService,
    private authService: AuthService,
    private routingService: RoutingService,
    private destroyRef: DestroyRef
  ) {
    effect(() => {
      this.dataType.set(data);
      if (this.dataService.getDestroyedState()) {
        return;
      }
      this.dialogRef.afterClosed().subscribe(() => {
        if (this.authService.isAuthenticated && data.notification) {
          this.routingService.toDashboard();
        }
      });
    }, { allowSignalWrites: true });
    this.destroyRef.onDestroy(() => {
      if (this.shouldSkipDestroyActions) {
        return;
      }
      this.dataService.markAsDestroyed();
      this.dataService.resetDestroyed();
    });
  }

  public get isSuccess(): boolean {
    return this.dataType().notification?.title === this.notifyText.successlog || this.dataType().notification?.title === this.notifyText.successreg;
  }

  public get form(): FormDialog | undefined {
    return this.dataType().form;
  }

  public get isAdd(): boolean {
    return this.form?.formTitle === this.formEnum.add;
  }

  public sendForm(form: FormGroup): void {
    const formTitle = this.data.form?.formTitle as FormEnum;
    this.dataService.addOrUpdateApplication(form.value, formTitle).subscribe();
    this.dialogRef.close();
  }

  public closeDialog(): void {
    this.dataService.setSpinnerState(false);
    this.dataService.setFetchingCities(false);
    this.dialogRef.close();
  }

  private get shouldSkipDestroyActions(): boolean {
    return !this.form || this.form.formType.invalid;
  }

}
