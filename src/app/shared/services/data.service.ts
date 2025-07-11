import { computed, Injectable, signal, WritableSignal } from "@angular/core";
import { catchError, Observable, of, switchMap, take, tap, throwError } from "rxjs";
import { ChartDataType1, ChartDataType2 } from "../../core/models/chart.interface";
import { ChartTimeLine, City, Country } from "../../core/models/data.interface";
import { ErrorMessages, NotificationsStatusEnum, UserMessages } from "../../core/models/enum/messages.enum";
import { CountriesEnum, FormEnum } from "../../core/models/enum/utils.enum";
import { ITableDataRow, ITableSaveRequest } from "../../core/models/table.interface";
import { AuthUserResponse, UserLogin, UserRequest, UserResponse, UserToken } from "../../core/models/users.interface";
import { ApiService } from "../../core/services/api.service";
import { AuthService } from './../../core/services/auth.service';
import { StateService } from "./state.service";

@Injectable({ providedIn: 'root' })
export class DataService {
  public _spinner = signal<boolean>(false);
  public readonly spinnerState = computed(() => this._spinner());
  public readonly cvProgressTimeline = computed(() => this.stateService._cvProgressTimeline());
  public readonly isDataExists = computed(() => this.stateService._isDataExists());
  public readonly tableDataResponse = computed(() => this.stateService._tableDataResponse());
  public readonly lastSortedDataSource = computed(() => this.stateService._lastSortedDataSource());
  public readonly isCachedRequest = computed(() => this.stateService._isCachedRequest());
  public readonly isFetchingCities = computed(() => this.stateService._isFetchingCities());
  public readonly currentCountryName = computed(() => this.stateService._currentCountryName());
  public readonly currentTabIndex = computed(() => this.stateService._currentTabIndex());
  public readonly globalFilteredData = computed(() => this.stateService._globalFilteredChartData());
  public readonly buttonText = computed(() => this.stateService._buttonText());
  public readonly progressChart = computed(() => this.stateService._progressChart());
  public readonly statusChart = computed(() => this.stateService._statusChart());
  public readonly daysFilter = computed(() => this.stateService._daysFilter());

  constructor(private apiService: ApiService, private authService: AuthService, private stateService: StateService) {
    this.getAllCountries().subscribe();
    this.getCitiesByCountry(CountriesEnum.primary).subscribe();
    this.getCompanies().subscribe();
  }

  public loginUser(loginForm: UserLogin): Observable<UserLogin | null> {
    loginForm.auth_token = this.authService.getToken();
    return this.apiService.loginUserReq(loginForm);
  }

  public addNewUser(user: UserRequest): Observable<UserToken> {
    return this.apiService.addNewUserReq(user).pipe(
      take(1),
      tap((userData: UserResponse) => {
        this.stateService._dataUserResponse.set(userData);
      }),
      switchMap((userResponse: UserResponse) => {
        return this.generateUserToken(userResponse)
          .pipe(
            take(1)
          );
      })
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
    return this.apiService.getUserDataReq(this.stateService._usersResponse().email).pipe(
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
    if (this.stateService._isCachedRequest()) {
      return this.apiService.authUserDataReq()
        .pipe(
          take(1),
          tap((tableData: ITableDataRow[]) => {
            if (tableData.length) {
              const statuses = tableData.map(td => td.status);
              this.stateService._statusPreviewList.set(statuses);
              this.stateService._tableDataResponse.set(tableData);
              this.stateService._lastSortedDataSource.set(tableData);
              this.stateService._isCachedRequest.set(false);
              this.stateService._isDataExists.set(true);
            }
          })
        );
    }
    return of(this.stateService._tableDataResponse());
  }

  public addOrUpdateApplication(row: ITableDataRow, formAction: FormEnum): Observable<ITableSaveRequest> {
    return this.apiService.addOrUpdateApplicationReq(row, formAction).pipe(
      take(1),
      tap(() => {
        this.stateService._isCachedRequest.set(true);
      }),
      catchError((err) => {
        return throwError(() => { console.error(err) })
      }))
  }

  public removeMultipleRows(selectedRows: ITableDataRow[], formAction: string): Observable<ITableDataRow[]> {
    return this.apiService.removeRowsReq(selectedRows, formAction)
      .pipe(
        take(1),
        tap((dataRows: ITableDataRow[]) => {
          this.stateService._tableDataResponse.set(dataRows);
          this.stateService._lastSortedDataSource.set(this.tableDataResponse());
          this.stateService._isCachedRequest.set(false);
          if (!dataRows.length) {
            this.stateService._isDataExists.set(false);
          }
        }),
        catchError((err) => {
          return throwError(() => { console.error(err) })
        }));
  }

  public getAllCountries(): Observable<Country[]> {
    return this.apiService.getCountriesListReq().pipe(
      take(1),
      tap((data: Country[]) => {
        this.stateService._countries.set(data);
      })
    )
  }

  public getCitiesByCountry(country: string): Observable<City> {
    this.stateService._currentCountryName.set(country);
    return this.apiService.getCitiesReq(country)
      .pipe(
        take(1),
        tap((cities: City) => {
          this.stateService._currentCitiesByCountry.set(cities);
          cities.data = cities.data.sort((a: string, b: string) => a.localeCompare(b.toLowerCase()));
          this.citiesOfCurrentCountry = cities;
        }),
      )
  }

  public getCompanies(): Observable<string[]> {
    return this.apiService.getCompaniesReq()
      .pipe(
        take(1),
        tap(companies => {
          if (companies) {
            this.stateService._companiesList.set(companies);
          }
        })
      );
  }

  public getChartData(): Observable<ChartTimeLine[]> {
    return this.apiService.getChartDataReq()
      .pipe(
        take(1),
        tap((data) => {
          this.stateService._cvProgressTimeline.set(data);
        }),
        catchError(err => throwError(() => console.error(`Error with incoming data from => ${err.url}`)))
      )
  }

  public setProgressChart(chartData: ChartDataType1[]) {
    this.stateService._progressChart.set(chartData)
  }
  public setStatusChart(chartData: ChartDataType2[]) {
    this.stateService._statusChart.set(chartData)
  }


  public markAsDestroyed(): void {
    this.stateService.destroyed$.set(true);
  }
  public resetDestroyed(): void {
    this.stateService.destroyed$.set(false);
  }
  public getDestroyedState(): boolean {
    return this.stateService.destroyed$();
  }

  public setCurrentTabIndex(val: number): void {
    this.stateService._currentTabIndex.set(val);
  }


  public setFetchingCities(value: boolean): void {
    this.stateService._isFetchingCities.set(value);
  }

  public setIsDataExists(val: boolean): void {
    this.stateService._isDataExists.set(val);
  }

  public setLastSortedDataSource(val: ITableDataRow[]) {
    this.stateService._lastSortedDataSource.set(val);
  }

  public setDaysFilter(val: number) {
    this.stateService._daysFilter.set(val);
  }

  public getDaysFilter(): WritableSignal<number> {
    return this.stateService._daysFilter;
  }

  public setGlobalFilteredData(data: ITableDataRow[]) {
    this.stateService._globalFilteredChartData.set(data);
  }

  public setHoverText(val: string): void {
    this.stateService._buttonText.set(val);
  }

  public setSpinnerState(val: boolean): void { this._spinner.set(val); }

  public get usersResponseState(): AuthUserResponse {
    return this.stateService._usersResponse();
  }
  public set usersResponseState(user: AuthUserResponse) {
    this.stateService._usersResponse.set(user);
  }

  public get dataUserResponse$(): UserResponse {
    return this.apiService.currentUserData$();
  }
  public set dataUserResponse$(userData: UserResponse) {
    this.apiService.currentUserData$.set(userData);
  }

  public get allCountries(): Country[] {
    return this.stateService._countries();
  }

  public get currentSelectedCountry(): Country {
    return this.stateService._currentCountry();
  }

  public get citiesOfCurrentCountry(): City {
    return this.stateService._currentCitiesByCountry();
  }
  public set citiesOfCurrentCountry(cities: City) {
    this.stateService._currentCitiesByCountry.set(cities);
  }

  public get listOfCompanies(): string[] {
    return this.stateService._companiesList();
  }

  public get notificationsType() {
    return {
      success: {
        login: {
          title: NotificationsStatusEnum.successlog,
          message: UserMessages.loginsuccess
        },
        register: {
          title: NotificationsStatusEnum.successreg,
          message: UserMessages.registrationsuccess
        }
      },
      fail: {
        invalidUser: {
          title: NotificationsStatusEnum.error,
          message: ErrorMessages.invalidusername
        },
        invalidPassword: {
          title: NotificationsStatusEnum.error,
          message: ErrorMessages.invalidpassword
        },
        userExists: {
          title: NotificationsStatusEnum.error,
          message: ErrorMessages.userexistserror
        },
        userLogin: {
          title: NotificationsStatusEnum.error,
          message: ErrorMessages.userloginerror
        },
      },
    }
  }

  public get statusPreviewsList(): string[] {
    return this.stateService._statusPreviewList();
  }

  public compareAndSortData(a: number | string, b: number | string, isAsc?: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
