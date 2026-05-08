import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, Inject, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { switchMap, take, tap } from 'rxjs';
import { Country } from '../../../core/models/data.interface';
import { ITableDataRow } from '../../../core/models/table.interface';
import { FormDialog, GenericDialogType } from '../../../core/models/dialog.interface';
import { ConsentDialogTitlesEnum, DialogBodyMessagesEnum, NotificationsStatusEnum, ValidationMessagesEnum } from '../../../core/models/enum/messages.enum';
import { StatusEnum } from '../../../core/models/enum/table-data.enum';
import { ContinentsEnum, FormEnum } from '../../../core/models/enum/utils.enum';
import { AuthService } from '../../../core/services/auth.service';
import { AddRowComponent } from '../../components/forms/add-row/add-row.component';
import { EditRowComponent } from '../../components/forms/edit-row/edit-row.component';
import { FirstToUpperCasePipe } from '../../pipes/custom-upper-case.pipe';
import { DataService } from '../../services/data.service';
import { RoutingService } from '../../services/routing.service';
import { WindowService } from '../../services/window.service';
import { TableDataFormRow } from './../../../core/models/forms.interface';

@Component({
  selector: 'app-generic-dialog',
  imports: [CommonModule, MatButtonModule, AddRowComponent, EditRowComponent, FirstToUpperCasePipe],
  templateUrl: './generic-dialog.component.html',
  styleUrl: './generic-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericDialogComponent {
  public dataType: WritableSignal<GenericDialogType> = signal<GenericDialogType>({});
  public countriesList: WritableSignal<Country[]> = signal([] as Country[]);
  public duplicateError: WritableSignal<string | null> = signal(null);
  public currentContinent!: ContinentsEnum;
  public editFormSnapshot!: TableDataFormRow;
  public notifyText = NotificationsStatusEnum;
  public formEnum = FormEnum;
  public consentBody = DialogBodyMessagesEnum;
  public consentTitle = ConsentDialogTitlesEnum;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: GenericDialogType,
    private dialogRef: MatDialogRef<GenericDialogComponent>,
    private dataService: DataService,
    private authService: AuthService,
    private routingService: RoutingService,
    private windowService: WindowService,
    private destroyRef: DestroyRef
  ) {
    effect(() => {
      this.dataType.set(data);
      if (this.dataService.getDestroyedState()) {
        return;
      }
      const authenticated = this.authService.isAuthenticated;
      this.dialogRef.afterClosed().subscribe(() => {
        if (authenticated && data.notification) {
          this.routingService.toDashboard();
        }
      });
    });
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

  public get isConsent(): boolean {
    return !!this.dataType().consent;
  }

  public get isAdd(): boolean {
    return this.form?.formTitle === this.formEnum.add;
  }

  public sendForm(form: FormGroup): void {
    const formTitle = this.data.form?.formTitle as FormEnum;
    if (formTitle === FormEnum.add) {
      const check = this.dataService.checkCompanyReapply(form.value.companyName, form.value.applicationDate);
      if (check === 'blocked') {
        this.duplicateError.set(ValidationMessagesEnum.duplicateTooSoon);
        return;
      }
      if (check === 'reapply') {
        form.patchValue({ status: StatusEnum.REAPPLIED });
      }
    }
    this.duplicateError.set(null);
    this.dataService.addOrUpdateApplication(form.getRawValue() as ITableDataRow, formTitle).subscribe();
    this.dialogRef.close();
  }

  public closeDialog(): void {
    this.dataService.setSpinnerState(false);
    this.dataService.setFetchingCities(false);
    this.dialogRef.close();
  }

  public onConsentConnect(): void {
    this.dataService.gmailConsent(true).pipe(
      take(1),
      switchMap(() => this.dataService.getGmailRedirectUrl()),
      tap(url => {
        this.windowService.openGmailConnect(url);
        this.dialogRef.close();
      })
    ).subscribe();
  }

  public onConsentDismiss(): void {
    this.dataService.declineConsent();
    this.dialogRef.close();
  }

  private get shouldSkipDestroyActions(): boolean {
    return !this.form || this.form.formType.invalid;
  }
}
