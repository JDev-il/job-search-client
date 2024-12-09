import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RegisterFormModel } from '../../../core/models/forms.interface';

import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { catchError, throwError } from 'rxjs';
import { AccountMessages } from '../../../core/models/enum/messages.enum';
import { TitleTextEnum } from '../../../core/models/enum/utils.interface';
import { UserRequest, UserToken } from '../../../core/models/users.interface';
import { AuthService } from '../../../core/services/auth.service';
import { BaseDialogComponent } from '../../base/dialog-base.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { HoverDirective } from '../../directives/hover.directive';
import { MaterialDirective } from '../../directives/material.directive';
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
  ) {
    super(dialog)
    this._initializeForm();
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
      this.spinnerState = true;
      const { confirm_password, ...userData } = this.registerationForm.value;
      this.stateService.addNewUser(<UserRequest>userData)
        .pipe(
          catchError((err: HttpErrorResponse) => {
            this.openDialog(TitleTextEnum.error, AccountMessages.failedMessage);
            return throwError(() => err);
          })
        ).subscribe({
          next: (tokenData: UserToken) => {
            console.log(tokenData);
            this.authService.setToken(tokenData.auth_token);
            this.openDialog(TitleTextEnum.success, AccountMessages.redirectMessage);
          },
          error: () => {
            this.openDialog(TitleTextEnum.failed, AccountMessages.failedMessage);
            return;
          }
      })
    }
  }

  private _initializeForm(): void {
    this.registerationForm = this.fb.group({
      firstName: this.fb.control('', [Validators.required, Validators.pattern(/^[\p{L}]+(([' -][\p{L}])?[\p{L}]*)*$/u)]),
      lastName: this.fb.control('', [Validators.required, Validators.pattern(/^[\p{L}]+(([' -][\p{L}])?[\p{L}]*)*$/u)]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', [Validators.required, Validators.minLength(3)]),
      confirm_password: this.fb.control('', Validators.required),
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirm_password')?.value;
    return password === confirmPassword ? null : { isConfirmed: true };
  }
}
