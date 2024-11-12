import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UsersMessages } from '../../../core/models/enum/messages.enum';
import { LoginModel } from '../../../core/models/forms.interface';
import { UserLogin, UserResponse } from '../../../core/models/users.interface';
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
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @ViewChild('snackBarRef') snackBar!: SnackBarDirective;
  public loginForm!: FormGroup<LoginModel>;

  get spinnerState(): boolean {
    return this.stateService.spinnerState;
  }

  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    private routingService: RoutingService,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }


  public submitLogin(): void {
    if (this.loginForm.valid) {
      this.stateService.spinnerState = true;
      const loginForm = <UserLogin>{
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }
      this.stateService.loginUser(loginForm).subscribe((user: UserResponse | null) => {
        if (!user) {
          this.showNotification();
        } else {
          this.routingService.toDashboard()
        }
      });
    }
  }

  private showNotification() {
    if (this.snackBar) {
      this.snackBar.customClass = "snack-container"
      this.snackBar.openSnackBar(UsersMessages.notExists);
    }
  }

}
