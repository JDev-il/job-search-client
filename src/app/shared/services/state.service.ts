import { Injectable, signal, WritableSignal } from '@angular/core';
import { catchError, Observable, of, Subject, switchMap, take, tap, throwError } from 'rxjs';
import { ChartData } from '../../core/models/chart.interface';
import { ErrorMessages, NotificationsStatusEnum, UserMessages } from '../../core/models/enum/messages.enum';
import { CountriesEnum, FormEnum } from '../../core/models/enum/utils.enum';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ChartTimeLine, City, Country } from './../../core/models/data.interface';
import { ITableDataRow, ITableSaveRequest } from './../../core/models/table.interface';
import { AuthUserResponse, UserLogin, UserRequest, UserResponse, UserToken } from './../../core/models/users.interface';

@Injectable({ providedIn: 'root' })
export class StateService {
  private readonly spinner = signal<boolean>(true);
  private readonly destroyed$ = signal<boolean>(false);
  private usersResponse: WritableSignal<AuthUserResponse> = signal<AuthUserResponse>({} as AuthUserResponse);
  private tableDataResponse: WritableSignal<ITableDataRow[]> = signal<ITableDataRow[]>([] as ITableDataRow[]);
  private dataUserResponse: WritableSignal<UserResponse> = signal({} as UserResponse);
  private countries: WritableSignal<Country[]> = signal<Country[]>([] as Country[]);
  private currentCountry: WritableSignal<Country> = signal<Country>({} as Country);
  private currentCitiesByCountry: WritableSignal<City> = signal<City>({} as City);
  private companiesList: WritableSignal<string[]> = signal<string[]>([] as string[])
  private statusPreviewList: WritableSignal<string[]> = signal<string[]>([]);
  private globalFilteredChartData: WritableSignal<ITableDataRow[]> = signal<ITableDataRow[]>([]);

  // public chartOptionsSource: WritableSignal<ChartOptions> = signal({} as ChartOptions);
  public currentChartData: WritableSignal<ChartData[]> = signal<ChartData[]>([]);
  public currentTabIndex: WritableSignal<number> = signal(0);
  public lastSortedDataSource: WritableSignal<ITableDataRow[]> = signal<ITableDataRow[]>([]);
  public cvProgressTimeline: WritableSignal<ChartTimeLine[]> = signal<ChartTimeLine[]>([]);
  public isCachedRequest: WritableSignal<boolean> = signal<boolean>(true);
  public currentCountryName: WritableSignal<string> = signal<string>('');
  public isDataExists = signal<boolean>(false);
  public buttonText = signal<string>("Don't have an account?");
  public isFetchingCities = signal(false);
  public isRegistrationError = signal(false);
  public destroy$: Subject<boolean> = new Subject();
  public chronicalDates = signal<string[]>([]);
  public daysFilter = signal<number>(0);

  constructor(private apiService: ApiService, private authService: AuthService) {
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
        this.dataUserResponse.set(userData);
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
    if (this.isCachedRequest()) {
      return this.apiService.authUserDataReq()
        .pipe(
          take(1),
          tap((tableData: ITableDataRow[]) => {
            if (tableData.length) {
              const statuses = tableData.map(td => td.status);
              this.statusPreviewList.set(statuses);
              this.tableDataResponse$ = tableData;
              this.isCachedRequest.set(false);
              this.isDataExists.set(true);
            }
          })
        );
    }
    return of(this.tableDataResponse());
  }

  public addOrUpdateApplication(row: ITableDataRow, formAction: FormEnum): Observable<ITableSaveRequest> {
    return this.apiService.addOrUpdateApplicationReq(row, formAction).pipe(
      take(1),
      tap(() => {
        this.isCachedRequest.set(true);
        this.authorizedUserDataRequest().pipe(take(1)).subscribe();
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
          this.tableDataResponse$ = dataRows;
          this.isCachedRequest.set(true);
          if (!dataRows.length) {
            this.isDataExists.set(false);
          }
        }),
        catchError((err) => {
          return throwError(() => { console.error(err) })
        }))
      ;
  }

  public getAllCountries(): Observable<Country[]> {
    return this.apiService.getCountriesListReq().pipe(
      take(1),
      tap((data: Country[]) => {
        this.countries.set(data);
      })
    )
  }

  public getCitiesByCountry(country: string): Observable<City> {
    this.currentCountryName.set(country);
    return this.apiService.getCitiesReq(country)
      .pipe(
        take(1),
        tap((cities: City) => {
          this.currentCitiesByCountry.set(cities);
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
            this.companiesList.set(companies);
          }
        })
      );
  }

  public getChartData(): Observable<ChartTimeLine[]> {
    return this.apiService.getChartDataReq()
      .pipe(
        take(1),
        tap((data) => {
          this.cvProgressTimeline.set(data);
        }),
        catchError(err => throwError(() => console.error(`Error with incoming data from => ${err.url}`)))
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

  public get tableDataResponse$(): ITableDataRow[] {
    return this.tableDataResponse();
  }
  public set tableDataResponse$(tableData: ITableDataRow[]) {
    this.tableDataResponse.set(tableData);
  }

  public get globalFilteredData$(): ITableDataRow[] {
    return this.globalFilteredChartData();
  }
  public set globalFilteredData$(filteredData: ITableDataRow[]) {
    this.globalFilteredChartData.set(filteredData);
  }
  public set globalFilteredDataUpdate$(filteredData: ITableDataRow[]) {
    this.globalFilteredChartData.update((f) => f = filteredData);
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

  public get listOfCompanies(): string[] {
    return this.companiesList();
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
    return this.statusPreviewList();
  }

  public get displayColumns(): string[] {
    return ['select', 'status', 'company', 'position', 'application', 'hunch', 'note'];
  }


}
