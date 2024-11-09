import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginModel } from '../../../core/models/forms.interface';
import { UserLogin } from '../../../core/models/users.interface';
import { AuthService } from '../../../core/services/auth.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { MaterialDirective } from '../../directives/material.directive';
import { StateService } from './../../services/state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports:
    [
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MaterialDirective,
      SpinnerComponent
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  public loginForm!: FormGroup<LoginModel>;

  get spinnerState(): boolean {
    return this.stateService.spinnerState;
  }

  constructor(private fb: FormBuilder, private stateService: StateService, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }


  public submitLogin(): void | string {
    if (this.loginForm.valid) {
      this.stateService.spinnerState = true;
      const loginForm = <UserLogin>{
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }
      this.stateService.loginUser(loginForm);
    }
  }


  public get notificationMessage(): string {
    return this.stateService.message();
  }
}
