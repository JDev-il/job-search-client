import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, Inject, signal, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { combineLatest, takeUntil } from 'rxjs';
import { FormDialog, GenericDialogType } from '../../../core/models/dialog.interface';
import { ContinentsEnum, FormEnum, NotificationsEnum } from '../../../core/models/enum/utils.enum';
import { AuthService } from '../../../core/services/auth.service';
import { AddRowComponent } from '../../components/forms/add-row/add-row.component';
import { EditRowComponent } from '../../components/forms/edit-row/edit-row.component';
import { FormsService } from '../../services/forms.service';
import { RoutingService } from '../../services/routing.service';
import { StateService } from './../../services/state.service';

@Component({
  selector: 'app-generic-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, AddRowComponent, EditRowComponent],
  templateUrl: './generic-dialog.component.html',
  styleUrl: './generic-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericDialogComponent {
  public dataType: WritableSignal<GenericDialogType> = signal<GenericDialogType>({});
  public notifyText = NotificationsEnum;
  public countriesList: WritableSignal<string[]> = signal([] as string[]);
  public currentContinent!: ContinentsEnum;
  public formEnum = FormEnum;
  constructor(
    private dialogRef: MatDialogRef<GenericDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GenericDialogType,
    private stateService: StateService,
    private authService: AuthService,
    private routingService: RoutingService,
    private formsService: FormsService,
    private destroyRef: DestroyRef
  ) {
    effect(() => {
      this.dataType.set(data);
      if (this.stateService.getDestroyedState()) {
        return;
      }
      this.dialogRef.afterClosed().subscribe(() => {
        if (this.authService.isAuthenticated && data.notification) {
          this.routingService.toDashboard();
        }
      });
    }, { allowSignalWrites: true });
    this.destroyRef.onDestroy(() => {
      this.stateService.markAsDestroyed();
      this.stateService.resetDestroyed();
    });
  }

  public get isSuccess(): boolean {
    return this.dataType().notification?.title === this.notifyText.successlogin || this.dataType().notification?.title === this.notifyText.successregister;
  }

  public get form(): FormDialog | undefined {
    return this.dataType().form;
  }

  public get isAdd(): boolean {
    return this.form?.formTitle === this.formEnum.add;
  }

  public sendForm(form: FormGroup): void {
    const formTitle = this.data.form?.formTitle as FormEnum;
    this.stateService.addOrUpdateApplication(form.value, formTitle);
    this.dialogRef.close();
  }

  public getContinentsList(selectedContinent: string): void {
    const continent = selectedContinent as ContinentsEnum;
    if (continent) {
      combineLatest({
        list: this.stateService.getContinents(continent)
      })
        .pipe(takeUntil(this.stateService.destroy$))
        .subscribe((data) => {
          const countries = data.list.map(c => c.name.common)
          this.countriesList.set(countries);
        })
    }
  }

  public closeDialog(): void {
    this.stateService.spinnerState = false;
    this.dialogRef.close();
  }

}
