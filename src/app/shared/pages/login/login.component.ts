import { ChangeDetectionStrategy, ChangeDetectorRef, Component, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UsersMessages } from '../../../core/models/enum/messages.enum';
import { LoginModel } from '../../../core/models/forms.interface';
import { UserLogin } from '../../../core/models/users.interface';
import { AuthService } from '../../../core/services/auth.service';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { MaterialDirective } from '../../directives/material.directive';
import { SnackBarDirective } from '../../directives/snackbar.directive';
import { RoutingService } from '../../services/routing.service';
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
      SnackBarDirective,
      SpinnerComponent
    ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../style/form-layout.style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {

  @ViewChild('snackBarRef') snackBar!: SnackBarDirective;
  public loginForm!: FormGroup<LoginModel>;
  public formError = signal<boolean>(false)

  get spinnerState(): boolean {
    return this.stateService.spinnerState;
  }
  public set spinnerState(value: boolean) {
    this.stateService.spinnerState = value;
  }
  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    private routingService: RoutingService,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  public submitLogin(): void {
    if (this.loginForm.valid) {
      this.formError.set(false);
      this.spinnerState = true;
      const loginForm = <UserLogin>{
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }
      this.stateService.loginUser(loginForm).subscribe({
        next: (res) => {
          if (res && res?.auth_token) {
            this.authService.setToken(res.auth_token);
            this.routingService.toDashboard();
          }
        },
        error: () => {
          this.formError.set(true);
          this.snackBar.openSnackBar(UsersMessages.notExists);
          this.resetLoginForm();
          this.cd.detectChanges()
        }
      });
    }
  }

  public toRegister(): void {
    this.routingService.toRegister();
  }

  private resetLoginForm(): void {
    this.loginForm.reset({
      email: '',
      password: '',
    });
  }
}
