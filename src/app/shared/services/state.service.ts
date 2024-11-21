import { Injectable, signal } from '@angular/core';
import { catchError, Observable, of, Subject, take, tap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { UserLogin, UserRequest, UserResponse, UserToken } from './../../core/models/users.interface';

@Injectable({ providedIn: 'root' })
export class StateService {

  private usersResponse = signal<UserResponse[]>(<UserResponse[]>{});
  private spinner = signal<boolean>(false);
  public destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private apiService: ApiService, private authService: AuthService) {
  }

  public loginUser(loginForm: UserLogin): Observable<UserLogin | null> {
    loginForm.auth_token = this.authService.getToken();
    return this.apiService.loginUserRequest(loginForm)
  }

  public addNewUser(user: UserRequest): Observable<UserResponse> {
    return this.apiService.addNewUserRequest(user).pipe(
      tap((userResponse: UserResponse) => {
        if (userResponse) {
          this.apiService.currentUserRequest$.set(userResponse);
        }
      }),
      catchError(error => {
        console.error('Error while adding new user:', error);
        return of(error);
      })
    );
  }

  public verifyUserToken(userToken?: string): Observable<string> {
    let token!: string;
    if (!userToken) {
      token = this.authService.getToken() || '';
    }
    return this.apiService.verifyToken(token);
  }

  public generateUserToken(user: UserLogin): Observable<UserToken> {
    return this.apiService.generateToken(user).pipe(
      take(1),
      catchError(error => {
        console.error('Token generation error:', error);
        return of(error);
      })
    );
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
