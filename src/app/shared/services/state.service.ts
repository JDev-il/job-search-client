import { Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, Observable, of, Subject, take, tap, throwError } from 'rxjs';
import { ITableRow } from '../../core/models/table.interface';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { AuthUserResponse, UserLogin, UserRequest, UserResponse, UserToken } from './../../core/models/users.interface';

@Injectable({ providedIn: 'root' })
export class StateService {
  private usersResponse!: AuthUserResponse;
  private spinner = signal<boolean>(false);
  private readonly destroyed$ = signal(false);
  private userDataSignal: WritableSignal<ITableRow[]> = signal<ITableRow[]>([]);
  private dataUserResponse: WritableSignal<UserResponse> = signal({} as UserResponse);

  public destroy$: Subject<boolean> = new Subject<boolean>(); //TODO: replace with destroyed<Signal>
  public buttonText = signal<string>("Don't have an account?");

  constructor(private apiService: ApiService, private authService: AuthService) {
  }

  public loginUser(loginForm: UserLogin): Observable<UserLogin | null> {
    loginForm.auth_token = this.authService.getToken();
    return this.apiService.loginUserRequest(loginForm)
  }

  public addNewUser(user: UserRequest): Observable<UserRequest> {
    return this.apiService.addNewUserRequest(user).pipe(
      tap((userResponse: UserRequest) => {
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

  public verifyUserToken(): Observable<UserLogin> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('Authentication token is required'));
    }
    return this.apiService.verifyToken(token); // Let errors propagate naturally
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

  public userDataRequest(): Observable<UserResponse | null> {
    return this.apiService.getUserData(this.usersResponse.email).pipe(
      take(1),
      tap((userData) => {
        if (userData && userData.email) {
          this.apiService.currentUserData.set(userData);
        }
      }),
      catchError(() => of(null))
    );
  }

  public authorizedUserData(): Observable<ITableRow[]> {
    return this.apiService.authUserData();
  }

  /*
    TODO:
    Add the following function
      public addApplicationData(): Observable<any> {return this.apiService.authUserData()}
  */



  public markAsDestroyed(): void {
    this.destroyed$.set(true);
  }
  public resetDestroyed(): void {
    this.destroyed$.set(false);
  }

  public getDestroyedState(): boolean {
    return this.destroyed$();
  }

  // Methods to update state
  public set setHoverText(hoverText: string) {
    this.buttonText.set(hoverText);
  }
  public set setUnhoverText(hoverText: string) {
    this.buttonText.set(hoverText);
  }

  public get spinnerState(): boolean {
    return this.spinner();
  }
  public set spinnerState(state: boolean) {
    this.spinner.set(state);
  }

  public get usersResponseState(): AuthUserResponse {
    return this.usersResponse;
  }
  public set usersResponseState(user: AuthUserResponse) {
    this.usersResponse = user;
  }

  public get dataUserResponse$(): UserResponse {
    return this.apiService.currentUserData();
  }
  public set dataUserResponse$(userData: UserResponse) {
    this.apiService.currentUserData.set(userData);
  }

}
