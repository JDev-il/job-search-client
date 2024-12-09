import { Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, Observable, of, Subject, switchMap, take, tap, throwError } from 'rxjs';
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

  public addNewUser(user: UserRequest): Observable<UserToken> {
    return this.apiService.addNewUserRequest(user).pipe(
      switchMap((userResponse: UserResponse) => {
        return this.generateUserToken(userResponse);
      }),
    );
  }

  public verifyUserToken(): Observable<UserLogin> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('Authentication token is required'));
    }
    return this.apiService.verifyToken(token);
  }

  public generateUserToken(user: UserResponse): Observable<UserToken> {
    return this.apiService.generateToken(user).pipe(
      take(1),
      catchError((err => {
        console.error("Token was not generated")
        return throwError(() => err)
      })
      ))
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
    return this.apiService.authUserData().pipe(take(1));
  }

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
