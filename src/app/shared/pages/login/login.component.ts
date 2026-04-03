import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { NotificationsStatusEnum } from '../../../core/models/enum/messages.enum';
import { ActionLables } from '../../../core/models/enum/utils.enum';
import { LoginModel } from '../../../core/models/forms.interface';
import { UserLogin } from '../../../core/models/users.interface';
import { AuthService } from '../../../core/services/auth.service';
import { ApiConfigService } from '../../../core/services/configuration.service';
import { BaseDialogComponent } from '../../base/dialog-base.component';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { HoverDirective } from '../../directives/hover.directive';
import { MaterialDirective } from '../../directives/material.directive';
import { SnackBarDirective } from '../../directives/snackbar.directive';
import { DataService } from '../../services/data.service';
import { RoutingService } from '../../services/routing.service';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../style/form-layout.style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent extends BaseDialogComponent implements OnInit {
  @ViewChild('snackBarRef') snackBar!: SnackBarDirective;
  private activateRoute = inject(ActivatedRoute);
  private apiConfig = inject(ApiConfigService);
  private platformId = inject(PLATFORM_ID);
  public loginForm!: FormGroup<LoginModel>;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
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
    this.dataService.setSpinnerState(false);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('google_token');
      if (token) {
        this.authService.setToken(token);
        this.routingService.toDashboard();
      }
    }
  }

  public signInWithGoogle(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = this.apiConfig.buildInternalUrl(
        this.apiConfig.internal.auth.path,
        this.apiConfig.internal.auth.google
      );
    }
  }

  public get spinnerState(): boolean {
    return this.dataService.spinnerState();
  }

  public get loginbuttonText() {
    return this.dataService.buttonText();
  }

  public toRegister(): void {
    this.loginForm.reset();
    this.routingService.toRegister();
  }

  public submitLogin(): void {
    if (this.loginForm.valid) {
      const loginForm = <UserLogin>{
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
      const notificationType = this.dataService.notificationsType;
      this.dataService.loginUser(loginForm).subscribe({
        next: (user: UserLogin | null) => {
          if (user !== null && user.auth_token) {
            this.dataService.setSpinnerState(true);
            this.authService.setToken(user.auth_token);
            this.snackBar.openSnackBar({ message: notificationType.success.login.message, title: NotificationsStatusEnum.successlog }, ActionLables.ok);
          } else {
            this.snackBar.openSnackBar({ message: notificationType.fail.invalidUser.message, title: NotificationsStatusEnum.error }, ActionLables.close);
            this.loginForm.reset();
          }
        },
        error: () => {
          this.snackBar.openSnackBar({ message: notificationType.fail.userLogin.message, title: NotificationsStatusEnum.error }, ActionLables.dismiss);
          this.loginForm.reset();
        },
        complete: () => this.cd.detectChanges()
      });
    }
  }
}
