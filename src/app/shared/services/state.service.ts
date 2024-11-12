import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { UserLogin, UserRequest, UserResponse } from './../../core/models/users.interface';

@Injectable({ providedIn: 'root' })
export class StateService {

  private usersResponse = signal<UserResponse[]>(<UserResponse[]>{});
  private spinner = signal<boolean>(false);
  private message = signal<string>('');


  constructor(private apiService: ApiService, private authService: AuthService, private router: Router) { }



  public loginUser(loginForm: UserLogin): Observable<UserResponse | null> {
    if (this.authService.isAuthenticated) {
      return this.apiService.loginUserRequest(loginForm);
    }
    return of(null)
  }

  public addNewUser(users: UserRequest): Observable<UserRequest> {
    this.spinnerState = false;
    return this.apiService.addNewUserRequest(users);
  }

  public get spinnerState(): boolean {
    return this.spinner();
  }
  public set spinnerState(state: boolean) {
    this.spinner.set(state);
  }


  public get usersResponseArray(): UserResponse[] {
    return this.usersResponse();
  }
  public set usersResponseArray(users: UserResponse[]) {
    this.usersResponse.set(users);
  }
}
