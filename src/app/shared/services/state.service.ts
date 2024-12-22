import { Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, Observable, of, Subject, switchMap, take, tap, throwError } from 'rxjs';
import { UserMessages, ValidationMessages } from '../../core/models/enum/messages.enum';
import { TitlesEnum } from '../../core/models/enum/utils.interface';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ITableDataResponse, ITableSaveRequest } from './../../core/models/table.interface';
import { AuthUserResponse, UserLogin, UserRequest, UserResponse, UserToken } from './../../core/models/users.interface';

@Injectable({ providedIn: 'root' })
export class StateService {
  private usersResponse: WritableSignal<AuthUserResponse> = signal<AuthUserResponse>({} as AuthUserResponse);
  private tableDataResponse$: WritableSignal<ITableDataResponse[]> = signal([] as ITableDataResponse[]);
  private dataUserResponse: WritableSignal<UserResponse> = signal({} as UserResponse);
  private readonly spinner = signal<boolean>(true);
  private readonly destroyed$ = signal<boolean>(false);
  public destroy$: Subject<boolean> = new Subject();
  public buttonText = signal<string>("Don't have an account?");
  public addedRows: WritableSignal<ITableDataResponse[]> = signal([] as ITableDataResponse[]);

  constructor(private apiService: ApiService, private authService: AuthService) {
  }

  public loginUser(loginForm: UserLogin): Observable<UserLogin | null> {
    loginForm.auth_token = this.authService.getToken();
    return this.apiService.loginUserReq(loginForm);
  }

  public addNewUser(user: UserRequest): Observable<UserToken> {
    return this.apiService.addNewUserReq(user).pipe(
    // tap((userData: UserResponse) => {
    //   this.dataUserResponse.set(userData);
    // }),
      switchMap((userResponse: UserResponse) => {
        return this.generateUserToken(userResponse)
          .pipe(
            take(1)
          );
      }),
    );
  }

  public verifyUserToken(): Observable<UserLogin> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('Authentication token is required'));
    }
    return this.apiService.verifyTokenReq(token);
  }

  public generateUserToken(user: UserResponse): Observable<UserToken> {
    return this.apiService.generateTokenReq(user).pipe(
      take(1),
      catchError((err => {
        console.error("Token was not generated")
        return throwError(() => err)
      })
      ))
  }

  public userDataRequest(): Observable<UserResponse | null> {
    return this.apiService.getUserDataReq(this.usersResponse().email).pipe(
      take(1),
      tap((userData) => {
        if (userData && userData.email) {
          this.apiService.currentUserData.set(userData);
          this.spinnerState = false;
        }
      }),
      catchError(() => of(null))
    );
  }

  public authorizedUserDataRequest(): Observable<ITableDataResponse[]> {
    return this.apiService.authUserDataReq().pipe(tap(tableData => {
      this.tableDataResponse$.set(tableData)
    }));
  }

  public addNewApplication(newTableRow: ITableSaveRequest): Observable<ITableDataResponse[]> {
    return this.apiService.addNewApplicationReq(newTableRow).pipe(
      take(1),
      tap((tableData: ITableDataResponse[]) => {
        console.log(tableData);
      }),
      catchError((err) => {
        return throwError(() => { return err })
      })
    )
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
  public set spinnerState(spinnerState: boolean) {
    this.spinner.set(spinnerState);
  }

  public get usersResponseState(): AuthUserResponse {
    return this.usersResponse();
  }
  public set usersResponseState(user: AuthUserResponse) {
    this.usersResponse.set(user);
  }

  public get dataUserResponse$(): UserResponse {
    return this.apiService.currentUserData();
  }
  public set dataUserResponse$(userData: UserResponse) {
    this.apiService.currentUserData.set(userData);
  }

  public get tableDataResponse(): ITableDataResponse[] {
    return this.tableDataResponse$();
  }


  public get notificationsType() {
    return {
      success: {
        title: TitlesEnum.success,
        message: UserMessages.success
      },
      error: {
        title: TitlesEnum.error,
        message: UserMessages.error
      },
      invalid: {
        title: TitlesEnum.error,
        message: ValidationMessages.invalidUsername
      }
    }
  }

}
