import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RegisterFormModel } from '../../../core/models/forms.interface';

import { UserRequest } from '../../../core/models/users.interface';
import { AuthService } from '../../../core/services/auth.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { MaterialDirective } from '../../directives/material.directive';
import { SnackBarDirective } from '../../directives/snackbar.directive';
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
    SpinnerComponent,
    SnackBarDirective
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  @ViewChild('snackBarRef') snackBar!: SnackBarDirective;
  public registerationForm!: FormGroup<RegisterFormModel>;


  public get spinnerState(): boolean {
    return this.stateService.spinnerState;
  }
  public set spinnerState(value: boolean) {
    this.stateService.spinnerState = value;
  }

  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    private authService: AuthService,
    private routingService: RoutingService
  ) {
    this._initializeForm();
    this.spinnerState = false;
  }

  public submitRegistrationForm(): void {
    if (this.registerationForm.valid) {
      this.stateService.spinnerState = true;
      const { confirm_password, ...userData } = this.registerationForm.value;
      this.stateService.addNewUser(userData as UserRequest)
        .subscribe((user: UserRequest) => {
          this.stateService.spinnerState = false;
          if (user) {
            this.authService.loginValidation();
            this.routingService.toDashboard();
          }
        });
    }
  }

  private _initializeForm(): void {
    this.registerationForm = this.fb.group({
      firstname: this.fb.control('', [Validators.required, Validators.pattern(/^[\p{L}]+(([' -][\p{L}])?[\p{L}]*)*$/u)]),
      lastname: this.fb.control('', [Validators.required, Validators.pattern(/^[\p{L}]+(([' -][\p{L}])?[\p{L}]*)*$/u)]),
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

