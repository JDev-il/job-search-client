import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, timer } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { UserLogin, UserRequest } from './../../core/models/users.interface';

@Injectable({ providedIn: 'root' })
export class StateService {

  spinner = signal<boolean>(false);
  message = signal<string>('');

  constructor(private apiService: ApiService, private authService: AuthService, private router: Router) { }

  get spinnerState(): boolean {
    return this.spinner();
  }

  public set spinnerState(state: boolean) {
    this.spinner.set(state);
  }

  public loginUser(loginForm: UserLogin): void | Error {
    if (this.authService.isAuthenticated) {
      this.spinnerState = false;
      this.apiService.loginUserRequest(loginForm);
    } else {
      this.message.set("Checking your status...")
      timer(3000).pipe(catchError(err => err)).subscribe(() => {
        this.message.set("Verifying...")
      }).add(() => {
        timer(4000).subscribe(() => {
          this.spinnerState = false;
          this.router.navigate(['register'], { replaceUrl: false })
        })
      })
    }
  }

  public addNewUser(users: UserRequest) {
    //! Integrate new user setup
    this.apiService.addNewUserRequest(users)
  }

}
