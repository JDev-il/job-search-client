import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RegisterFormModel } from '../../../core/models/forms.interface';

import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { catchError, throwError } from 'rxjs';
import { NotificationsStatusEnum } from '../../../core/models/enum/messages.enum';
import { ActionLables } from '../../../core/models/enum/utils.enum';
import { UserRequest, UserToken } from '../../../core/models/users.interface';
import { AuthService } from '../../../core/services/auth.service';
import { BaseDialogComponent } from '../../base/dialog-base.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { HoverDirective } from '../../directives/hover.directive';
import { MaterialDirective } from '../../directives/material.directive';
import { SnackBarDirective } from '../../directives/snackbar.directive';
import { DataService } from '../../services/data.service';
import { FormsService } from '../../services/forms.service';
import { RoutingService } from '../../services/routing.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MaterialDirective,
    HoverDirective,
    SpinnerComponent,
    SnackBarDirective
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss', '../../style/form-layout.style.scss']
})
export class RegistrationComponent extends BaseDialogComponent {
  @ViewChild('snackBarRef') snackBar!: SnackBarDirective;
  public registerationForm!: FormGroup<RegisterFormModel>;
  constructor(
    dialog: MatDialog,
    private dataService: DataService,
    private authService: AuthService,
    private routingService: RoutingService,
    private formService: FormsService
  ) {
    super(dialog)
    this.registerationForm = this.formService.initializeRegistrationForm();
    this.dataService.setSpinnerState(false);
  }

  public get spinnerState(): boolean {
    return this.dataService.spinnerState();
  }

  public toLogin(): void {
    this.registerationForm.reset();
    this.routingService.toLogin();
  }

  public get loginbuttonText() {
    return this.dataService.buttonText()
  }

  public submitRegistrationForm(): void {
    if (this.registerationForm.valid) {
      const notificationType = this.dataService.notificationsType;
      const { confirm_password, ...userData } = this.registerationForm.value;
      this.dataService.setSpinnerState(true);
      this.dataService.addNewUser(<UserRequest>userData)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            this.dataService.setSpinnerState(false);
            this.resetEmailPassword();
            this.snackBar.openSnackBar({ message: notificationType.fail.userExists.message, title: NotificationsStatusEnum.error }, ActionLables.tryagain);
            return throwError(() => err);
          })
        ).subscribe({
          next: (tokenData: UserToken) => {
            this.authService.setToken(tokenData.auth_token);
            this.snackBar.openSnackBar({ message: notificationType.success.register.message, title: notificationType.success.register.title }, ActionLables.thanks);
          },
          error: (err) => {
            throwError(() => console.error(`There was a problem generating a token`, err));
          }
        })
    }
  }

  private resetEmailPassword(): void {
    this.registerationForm.get('email')?.reset();
    this.registerationForm.get('password')?.reset();
    this.registerationForm.get('confirm_password')?.reset();
  }
}
