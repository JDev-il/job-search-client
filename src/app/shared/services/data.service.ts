import { computed, Injectable, signal, WritableSignal } from "@angular/core";
import { catchError, map, Observable, of, switchMap, take, tap, throwError } from "rxjs";
import { ChartDataType1, MarketChartData } from "../../core/models/chart.interface";
import { ChartTimeLine, City, Country, IFollowUpData } from "../../core/models/data.interface";
import { ErrorMessagesEnum, NotificationsStatusEnum, UserMessagesEnum } from "../../core/models/enum/messages.enum";
import { CountriesEnum, FormEnum } from "../../core/models/enum/utils.enum";
import { ITableDataRow, ITableSaveRequest } from "../../core/models/table.interface";
import { AuthorizedUser, AuthUserResponse, IUserData, UserLogin, UserRequest, UserResponse, UserToken } from "../../core/models/users.interface";
import { ApiService } from "../../core/services/api.service";
import { GmailApiService } from "../../core/services/gmail-api.service";
import { CONSENT_DECLINED_KEY } from '../constants/aliases';
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
  public readonly progressChartStatuses = computed(() => this.stateService._progressChartStatuses());
  public readonly progressChartCompanies = computed(() => this.stateService._progressChartCompanies());
  public readonly statusChart = computed(() => this.stateService._statusChart());
  public readonly statusChartCompanies = computed(() => this.stateService._statusChartCompanies());
  public readonly marketChart = computed(() => this.stateService._marketChart());
  public readonly daysFilter = computed(() => this.stateService._daysFilter());
  public readonly suggestions = computed(() => this.stateService._agentSuggestions());;
  public readonly criteria = computed(() => this.stateService._jobSearchCriterias());
  public readonly followUpData = computed(() => this.stateService._followUpData());
  public readonly userData = computed(() => this.stateService._dataUserResponse());
  public readonly isGmailState = computed(() => this.stateService._gmailEmail());
  public readonly gmailConsentState = computed(() => this.stateService._gmailConsent());
  public readonly isInitialData = computed(() => this.stateService._isInitialData());
  public readonly isNewUser = computed(() => this.stateService._isNewUser());

  private get isLocalStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }

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
          message: UserMessagesEnum.loginsuccess
        },
        register: {
          title: NotificationsStatusEnum.successreg,
          message: UserMessagesEnum.registrationsuccess
        }
      },
      fail: {
        invalidUser: {
          title: NotificationsStatusEnum.error,
          message: ErrorMessagesEnum.invalidusername
        },
        invalidPassword: {
          title: NotificationsStatusEnum.error,
          message: ErrorMessagesEnum.invalidpassword
        },
        userExists: {
          title: NotificationsStatusEnum.error,
          message: ErrorMessagesEnum.userexistserror
        },
        userLogin: {
          title: NotificationsStatusEnum.error,
          message: ErrorMessagesEnum.userloginerror
        },
      },
    }
  }

  public get statusPreviewsList(): string[] {
    return this.stateService._statusPreviewList();
  }


  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private stateService: StateService,
    private gmailApiService: GmailApiService,
  ) {
    if (this.isLocalStorage && localStorage.getItem(CONSENT_DECLINED_KEY) === 'true') {
      this.stateService._gmailConsent.set(false);
    }
    this.getAllCountries().subscribe();
    this.getCitiesByCountry(CountriesEnum.primary).subscribe();
    this.getCompanies().subscribe();
  }

  public loginUser(loginForm: UserLogin): Observable<UserLogin | null> {
    loginForm.auth_token = this.authService.getToken();
    return this.apiService.loginUserReq(loginForm).pipe(
      tap(user => {
        if (user && user.gmailConsent !== undefined) {
          this.stateService._gmailConsent.set(user.gmailConsent);
        }
        if (user && user.gmailEmail !== undefined) {
          this.stateService._gmailEmail.set(user.gmailEmail ?? null);
        }
        this.stateService._isNewUser.set(false);
      })
    );
  }

  public addNewUser(user: UserRequest): Observable<UserToken> {
    return this.apiService.addNewUserReq(user).pipe(
      take(1),
      tap((userData: UserResponse) => {
        this.stateService._dataUserResponse.set(userData);
        this.stateService._isNewUser.set(true);
      }),
      switchMap(() => {
        return this.generateUserToken({ email: user.email, password: user.password })
          .pipe(
            take(1)
          );
      })
    );
  }

  public verifyUserToken(): Observable<AuthorizedUser> {
    const token = this.authService.getToken();
    if (!token) {
      return throwError(() => new Error('Authentication token is required'));
    }
    return this.apiService.verifyTokenReq(token);
  }

  public generateUserToken(user: UserLogin): Observable<UserToken> {
    return this.apiService.generateTokenReq(user).pipe(
      take(1),
      catchError((err => {
        console.error("Token was not generated")
        return throwError(() => err)
      })
      ))
  }

  public connectGmail(): Observable<{ url: string }> {
    const token = this.authService.getToken()!;
    return this.gmailApiService.gmailConnectReq(token);
  }

  public disconnectGmail(): Observable<void> {
    const token = this.authService.getToken()!;
    return this.gmailApiService.disconnectGmailReq(token).pipe(
      take(1),
      tap(() => {
        this.stateService._gmailEmail.set(null);
        this.stateService._gmailConsent.set(false);
      }),
    );
  }

  public declineConsent(): void {
    if (this.isLocalStorage) {
      localStorage.setItem(CONSENT_DECLINED_KEY, 'true');
    }
    this.stateService._gmailConsent.set(false);
  }


  public gmailConsent(hasConsent: boolean): Observable<{ gmailConsent: boolean }> {
    const token = this.authService.getToken()!;
    return this.gmailApiService.postGmailConsentReq(token, hasConsent).pipe(
      take(1),
      tap(res => {
        this.stateService._gmailConsent.set(res.gmailConsent);
      }),
      catchError(err => {
        console.error('[gmail/consent] failed', err);
        return throwError(() => err);
      })
    );
  }

  public getGmailRedirectUrl(): Observable<string> {
    const token = this.authService.getToken()!;
    return this.gmailApiService.gmailConnectReq(token).pipe(
      take(1),
      map(res => res.url)
    );
  }

  public gmailStatus(token: string): Observable<{ gmailEmail: string | null }> {
    return this.gmailApiService.getGmailStatusReq(token).pipe(
      take(1),
      tap((res) => {
        this.stateService._gmailEmail.set(res.gmailEmail);
        if (res.gmailEmail) {
          if (this.isLocalStorage) {
            localStorage.removeItem(CONSENT_DECLINED_KEY);
          }
          this.stateService._gmailConsent.set(true);
        }
      }),
      catchError(err => {
        console.error('[gmail/status] failed', err);
        return of({ gmailEmail: null as string | null });
      }),
    )
  }

  public userDataRequest(): Observable<UserResponse | null> {
    return this.apiService.getUserDataReq(this.stateService._usersResponse().email).pipe(
      take(1),
      tap((userData) => {
        if (userData && userData.email) {
          this.stateService._dataUserResponse.set(userData);
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

  public checkCompanyReapply(companyName: string, newDate: Date | string | null): 'blocked' | 'reapply' | null {
    const normalized = companyName.trim().toLowerCase();
    const matches = this.tableDataResponse().filter(r =>
      r.companyName.trim().toLowerCase() === normalized && r.applicationDate
    );
    if (!matches.length) return null;
    const mostRecent = this.calcMostRecent(matches);
    const daysDiff = this.calcDaysDiff(newDate, mostRecent);
    return daysDiff < 7 ? 'blocked' : 'reapply';
  }

  public addOrUpdateApplication(row: ITableDataRow, formAction: FormEnum): Observable<ITableSaveRequest> {
    return this.apiService.addOrUpdateApplicationReq(row, formAction).pipe(
      take(1),
      tap(() => {
        if (!this.isDataExists() && this.isInitialData()) {
          this.setInitialData();
        }
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
          cities.data = cities.data.sort((a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()));
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
    this.stateService._progressChart.set(chartData);
  }
  public setProgressChartStatuses(chartData: ChartDataType1[]) {
    this.stateService._progressChartStatuses.set(chartData);
  }
  public setProgressChartCompanies(companies: Record<string, Array<{ name: string; status: string }>>) {
    this.stateService._progressChartCompanies.set(companies);
  }
  public setStatusChart(chartData: ChartDataType1[]) {
    this.stateService._statusChart.set(chartData);
  }
  public setStatusChartCompanies(companies: Record<string, string[]>) {
    this.stateService._statusChartCompanies.set(companies);
  }
  public setMarketChart(chartData: MarketChartData) {
    this.stateService._marketChart.set(chartData);
  }
  public setFollowUpData(data: IFollowUpData): void {
    this.stateService._followUpData.set(data);
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

  public userDetails(): IUserData {
    return { userId: this.userData().userId, email: this.userData().email, firstName: this.userData().firstName, lastName: this.userData().lastName };
  }

  public compareAndSortData(a: number | string, b: number | string, isAsc?: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private calcDaysDiff(newDate: Date | string | null, mostRecent: ITableDataRow): number {
    return (new Date(newDate ?? Date.now()).getTime() - new Date(mostRecent.applicationDate!).getTime()) / 86_400_000;
  }

  private calcMostRecent(matches: ITableDataRow[]): ITableDataRow {
    return matches.reduce((latest, r) =>
      new Date(r.applicationDate!).getTime() > new Date(latest.applicationDate!).getTime() ? r : latest
    );
  }

  private setInitialData(): void {
    this.stateService._isInitialData.set(false);
  }
}
