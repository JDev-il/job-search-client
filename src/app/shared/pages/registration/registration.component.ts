import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RegisterFormModel } from '../../../core/models/forms.interface';

import { UserRequest } from '../../../core/models/users.interface';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { MaterialDirective } from '../../directives/material.directive';
import { DataService } from '../../services/data.service';
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
    SpinnerComponent
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  public registerationForm!: FormGroup<RegisterFormModel>;

  public get spinnerState(): boolean {
    return this.stateService.spinnerState;
  }

  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    private dataService: DataService
  ) {
    this._initializeForm();
  }

  public submitRegistrationForm(): void {
    if (this.registerationForm.valid) {
      const { confirm_password, ...userData } = this.registerationForm.value;
      this.stateService.spinnerState = true;
      this.stateService.addNewUser(userData as UserRequest);
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

