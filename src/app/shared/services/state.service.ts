import { Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, Observable, Subject, switchMap, take, takeUntil, tap, throwError } from 'rxjs';
import { UserMessages, ValidationMessages } from '../../core/models/enum/messages.enum';
import { FormEnum, NotificationsEnum } from '../../core/models/enum/utils.enum';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { City, Country } from './../../core/models/data.interface';
import { ITableDataRow, ITableSaveRequest } from './../../core/models/table.interface';
import { AuthUserResponse, UserLogin, UserRequest, UserResponse, UserToken } from './../../core/models/users.interface';

@Injectable({ providedIn: 'root' })
export class StateService {
  private readonly spinner = signal<boolean>(true);
  private readonly destroyed$ = signal<boolean>(false);
  private usersResponse: WritableSignal<AuthUserResponse> = signal<AuthUserResponse>({} as AuthUserResponse);
  private tableDataResponse$: WritableSignal<ITableDataRow[]> = signal([] as ITableDataRow[]);
  private dataUserResponse: WritableSignal<UserResponse> = signal({} as UserResponse);
  private countries: WritableSignal<Country[]> = signal<Country[]>([] as Country[])
  private currentCountry: WritableSignal<Country> = signal<Country>({} as Country);
  private currentCitiesByCountry: WritableSignal<City> = signal<City>({} as City);
  private filteredCities: WritableSignal<string[]> = signal<string[]>([] as string[]);
  public isDataExists = signal<boolean>(false);
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
      tap((userData: UserResponse) => {
        this.dataUserResponse.set(userData);
      }),
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
        }
      }),
      catchError((err) => throwError(() => err))
    );
  }

  public authorizedUserDataRequest(): Observable<ITableDataRow[]> {
    return this.apiService.authUserDataReq()
      .pipe(
        take(1),
        tap((tableData) => {
          if (tableData.length) {
            this.tableDataResponse = tableData
            this.isDataExists.set(true)
          }
        })
      );
  }

  public addOrUpdateApplication(row: ITableDataRow, formAction: FormEnum): Observable<ITableSaveRequest> {
    return this.apiService.addOrUpdateApplicationReq(row, formAction).pipe(
      take(1),
      catchError((err) => {
        return throwError(() => { console.error(err) })
      }))
  }

  public removeMultipleRows(selectedRows: ITableDataRow[], formAction: string): Observable<ITableDataRow[]> {
    return this.apiService.removeRowsReq(selectedRows, formAction)
      .pipe(
        take(1),
        catchError((err) => {
          return throwError(() => { console.error(err) })
        }))
      ;
  }

  public getAllCountries(): Observable<Country[]> { // Triggered at the highest level
    return this.apiService.getCountriesListReq().pipe(
      takeUntil(this.destroy$),
      tap(data => {
        this.countries.set(data);
      })
    )
  }

  public getCities(country: string): Observable<City> {
    return this.apiService.getCitiesReq(country)
      .pipe(
        take(1),
        tap((city: City) => {
          const data = city as City;
          this.citiesOfCurrentCountry = data
        }),
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

  public get tableDataResponse(): ITableDataRow[] {
    return this.tableDataResponse$();
  }
  public set tableDataResponse(tableData: ITableDataRow[]) {
    this.tableDataResponse$.set(tableData);
  }

  public get allCountries(): Country[] {
    return this.countries();
  }

  public get currentSelectedCountry(): Country {
    return this.currentCountry();
  }

  public get citiesOfCurrentCountry(): City {
    return this.currentCitiesByCountry();
  }
  public set citiesOfCurrentCountry(cities: City) {
    this.currentCitiesByCountry.set(cities);
  }

  public get filteredCitiesByCountry(): string[] {
    return this.filteredCities();
  }
  public set filteredCitiesByCountry(cities: string[]) {
    this.filteredCities.set(cities);
  }


  public get notificationsType() {
    return {
      success: {
        login: {
          title: NotificationsEnum.successlogin,
          message: UserMessages.success
        },
        register: {
          title: NotificationsEnum.successregister,
          message: UserMessages.success
        }
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

}
