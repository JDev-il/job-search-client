import { ChangeDetectionStrategy, ChangeDetectorRef, Component, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IncorrectCredentialsMessages, LoginMessages } from '../../../core/models/enum/messages.enum';
import { LoginModel } from '../../../core/models/forms.interface';
import { UserLogin } from '../../../core/models/users.interface';
import { AuthService } from '../../../core/services/auth.service';
import { BaseComponent } from '../../base/baseComponent.base';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { HoverDirective } from '../../directives/hover.directive';
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
      HoverDirective,
      // SnackBarDirective,
      SpinnerComponent
    ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../style/form-layout.style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent extends BaseComponent {
  @ViewChild('snackBarRef') snackBar!: SnackBarDirective;
  public loginForm!: FormGroup<LoginModel>;
  public formError = signal<boolean>(false);

  public get spinnerState(): boolean {
    return this.stateService.spinnerState;
  }
  public set spinnerState(value: boolean) {
    this.stateService.spinnerState = value;
  }

  public toRegister(): unknown {
    this.resetLoginForm();
    return this.routingService.toRegister();
  }

  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    private routingService: RoutingService,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
    dialog: MatDialog
  ) {
    super(dialog);
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  public get loginbuttonText() {
    return this.stateService.buttonText()
  }

  public submitLogin(): void {
    if (this.loginForm.valid) {
      this.formError.set(false);
      const loginForm = <UserLogin>{
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }
      this.spinnerState = true;
      this.stateService.loginUser(loginForm).subscribe({
        next: (res: UserLogin | null) => {
          if (res !== null && res.auth_token) {
            this.authService.setToken(res.auth_token);
            this.openErrorDialog(LoginMessages.success)
          }
        },
        error: () => {
          this.formError.set(true);
          this.openErrorDialog(IncorrectCredentialsMessages.invalid);
          this.resetLoginForm();
          this.cd.detectChanges();
        }
      });
    }
  }

  private resetLoginForm(): void {
    this.loginForm.reset({
      email: '',
      password: '',
    });
  }
}
