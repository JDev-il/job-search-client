import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RegisterFormModel } from '../../../core/models/forms.interface';

import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { catchError, throwError } from 'rxjs';
import { UserRequest, UserToken } from '../../../core/models/users.interface';
import { AuthService } from '../../../core/services/auth.service';
import { BaseDialogComponent } from '../../base/dialog-base.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { HoverDirective } from '../../directives/hover.directive';
import { MaterialDirective } from '../../directives/material.directive';
import { FormsService } from '../../services/forms.service';
import { RoutingService } from '../../services/routing.service';
import { StateService } from '../../services/state.service';

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
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss', '../../style/form-layout.style.scss']
})
export class RegistrationComponent extends BaseDialogComponent {

  public registerationForm!: FormGroup<RegisterFormModel>;

  public get spinnerState(): boolean {
    return this.stateService.spinnerState;
  }
  public set spinnerState(value: boolean) {
    this.stateService.spinnerState = value;
  }

  constructor(
    dialog: MatDialog,
    private fb: FormBuilder,
    private stateService: StateService,
    private authService: AuthService,
    private routingService: RoutingService,
    private formService: FormsService
  ) {
    super(dialog)
    this.registerationForm = this.formService.initializeRegistrationForm()
    this.spinnerState = false;
  }

  public toLogin(): void {
    this.registerationForm.reset();
    this.routingService.toLogin();
  }

  public get loginbuttonText() {
    return this.stateService.buttonText()
  }

  public submitRegistrationForm(): void {
    if (this.registerationForm.valid) {
      const notification = this.stateService.notificationsType;
      this.spinnerState = true;
      const { confirm_password, ...userData } = this.registerationForm.value;
      this.stateService.addNewUser(<UserRequest>userData)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            this.openDialog({ notification: notification.error });
            return throwError(() => err);
          })
        ).subscribe({
          next: (tokenData: UserToken) => {
            this.authService.setToken(tokenData.auth_token);
            this.openDialog({ notification: notification.success.register });
          },
          error: (err) => {
            throwError(() => console.error(`There was a problem generating a token`, err));
          }
        })
    }
  }
}
