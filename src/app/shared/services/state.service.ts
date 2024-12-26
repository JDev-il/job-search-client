import { Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, Observable, of, Subject, switchMap, take, takeUntil, tap, throwError } from 'rxjs';
import { UserMessages, ValidationMessages } from '../../core/models/enum/messages.enum';
import { ContinentsEnum, NotificationsEnum } from '../../core/models/enum/utils.enum';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Country } from './../../core/models/data.interface';
import { ITableDataResponse, ITableRow } from './../../core/models/table.interface';
import { AuthUserResponse, UserLogin, UserRequest, UserResponse, UserToken } from './../../core/models/users.interface';

@Injectable({ providedIn: 'root' })
export class StateService {
  private usersResponse: WritableSignal<AuthUserResponse> = signal<AuthUserResponse>({} as AuthUserResponse);
  private tableDataResponse$: WritableSignal<ITableDataResponse[]> = signal([] as ITableDataResponse[]);
  private dataUserResponse: WritableSignal<UserResponse> = signal({} as UserResponse);
  private countriesList: WritableSignal<string[]> = signal([] as string[])
  private readonly spinner = signal<boolean>(true);
  private readonly destroyed$ = signal<boolean>(false);
  public destroy$: Subject<boolean> = new Subject();
  public buttonText = signal<string>("Don't have an account?");

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
          this.apiService.currentUserData$.set(userData);
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

  public addNewApplication(newTableRow: ITableRow): Observable<ITableDataResponse> {

  //! ERROR OCCURS WITH STATUS UNDEFINED IN TEMPLATE
  //TODO: fix issue with deep debugging process

    return this.apiService.addNewApplicationReq(newTableRow).pipe(
      take(1),
      tap(tableData => this.tableDataResponse$.set([...this.tableDataResponse, tableData])),
      catchError((err) => {
        return throwError(() => { return err })
      }))
  }

  public editApplication(editableTableRow: ITableDataResponse): Observable<ITableDataResponse[]> {
    console.log("EDITABLE ROW", editableTableRow);
    return of()
  // return this.apiService.editApplicationReq(editableTableRow);
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
    return this.apiService.currentUserData$();
  }
  public set dataUserResponse$(userData: UserResponse) {
    this.apiService.currentUserData$.set(userData);
  }

  public get tableDataResponse(): ITableDataResponse[] {
    return this.tableDataResponse$();
  }



  public get notificationsType() {
    return {
      success: {
        title: NotificationsEnum.success,
        message: UserMessages.success
      },
      error: {
        title: NotificationsEnum.error,
        message: UserMessages.error
      },
      invalid: {
        title: NotificationsEnum.error,
        message: ValidationMessages.invalidUsername
      }
    }
  }

  public getContinent(continent: ContinentsEnum): Observable<Country[]> {
    return this.apiService.getCountriesListReq(continent)
      .pipe(
        takeUntil(this.destroy$),
        tap(data => console.log(data)
        )
      )
  }

}
