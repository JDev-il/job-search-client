import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';
import { ChartTimeLine, City, Country } from '../models/data.interface';
import { ParamsOrder, ParamsOrderBy } from '../models/enum/params.enum';
import { CountriesEnum, FormEnum } from '../models/enum/utils.enum';
import { IMCPRequest } from '../models/mcp.inrerface';
import { CityReqParams } from '../models/requests.intefrace';
import { UserLogin, UserResponse, UserToken } from '../models/users.interface';
import { ITableDataRow, ITableSaveRequest } from './../models/table.interface';
import { UserRequest } from './../models/users.interface';
import { ApiConfigService } from './configuration.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  public currentUserData$ = signal<UserResponse>({} as UserResponse);
  public currentUserRequest$ = signal<UserLogin>({} as UserLogin);

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfigService // Inject the new config service
  ) { }

  public getChartDataReq(): Observable<ChartTimeLine[]> {
    // Use the new config service method
    const url = this.apiConfig.getTimelineUrl();
    return this.http.get<ChartTimeLine[]>(url);
  }

  public getCountriesListReq(): Observable<Country[]> {
    // Use mock API URL from config - you might want to make this configurable
    const url = this.apiConfig.external.geo.countries.mockUrl || this.apiConfig.getCountriesUrl();
    return this.http.get<Country[]>(url)
      .pipe(map(data => data
        .sort((a, b) =>
          a.name.common.localeCompare(b.name.common))
      ));
  }

  public getCitiesReq(country: string): Observable<City> {
    if (country === CountriesEnum.primary) {
      // Use Israeli cities endpoint
      const url = this.apiConfig.external.geo.cities.israeli;
      return this.http
        .get<City[]>(url)
        .pipe(
          map((res) => res[0])
        );
    }

    const citiesData: CityReqParams = {
      order: ParamsOrder.ASC,
      orderBy: ParamsOrderBy.NAME,
      country: country.toLowerCase()
    };

    // Use the cities filter endpoint
    const url = this.apiConfig.getCitiesUrl(this.apiConfig.external.geo.cities.filter);
    return this.http
      .post<City>(url, citiesData)
      .pipe(
        map((res): City => (
          {
            error: res.error,
            msg: res.msg,
            data: res.data.map((entry: any) => entry.city) ?? []
          }))
      );
  }


  public getCompaniesReq(): Observable<string[]> {
    // Use the companies config
    const baseUrl = this.apiConfig.external.companies.baseUrl;
    return forkJoin([
      this.http.get<string[]>(`${baseUrl}companies`),
      this.http.get<string[]>(`${baseUrl}companies_1`),
      this.http.get<string[]>(`${baseUrl}companies_2`),
      this.http.get<string[]>(`${baseUrl}companies_3`)
    ]).pipe(
      map(companies => companies.flat())
    );
  }

  public addNewUserReq(userData: UserRequest): Observable<UserResponse> {
    // Use the new config service for internal API
    const url = this.apiConfig.getUsersUrl(this.apiConfig.internal.users.add);
    return this.http.post<UserResponse>(url, userData);
  }

  public loginUserReq(userLoginForm: UserLogin): Observable<UserLogin> {
    return of(userLoginForm).pipe(
      switchMap(form => {
        const loginData = form.auth_token ? { ...form } : { email: form.email, password: form.password };
        const headers = form.auth_token ? { Authorization: `Bearer ${form.auth_token}` } : null;

        // Use the new config service for auth endpoint
        const url = this.apiConfig.getAuthUrl(this.apiConfig.internal.auth.login);

        return this.http.post<UserLogin>(
          url,
          loginData,
          headers ? { headers } : {}
        );
      })
    );
  }

  public verifyTokenReq(token: string): Observable<UserLogin> {
    // Use the new config service for auth verify endpoint
    const url = this.apiConfig.getAuthUrl(this.apiConfig.internal.auth.verify);
    return this.http.get<UserLogin>(url, {
      headers: { 'authorization': `Bearer ${token}` }
    });
  }

  public generateTokenReq(user: UserLogin): Observable<UserToken> {
    // Use the new config service for token generation
    const url = this.apiConfig.getAuthUrl(this.apiConfig.internal.auth.sign);
    return this.http.post<UserToken>(url, user, { responseType: 'json' });
  }

  public getUserDataReq(user_id: string): Observable<UserResponse> {
    return of(user_id).pipe(
      switchMap((id: string) => {
        if (id) {
          // Use the new config service for users endpoint
          const url = this.apiConfig.getUsersUrl(this.apiConfig.internal.users.user);
          return this.http
            .get<UserResponse>(
              url,
              { params: new HttpParams().append('user_id', id) }
            )
        } else {
          return throwError(() => new Error('User ID is required'));
        }
      }))
  }

  public authUserDataReq(): Observable<ITableDataRow[]> { // After user is authenticated
    const user_id = this.currentUserData$()?.userId;
    // Use the new config service for job search endpoint
    const url = this.apiConfig.getJobSearchUrl(this.apiConfig.internal.jobSearch.getApplications);
    return this.http.get<ITableDataRow[]>(url, { params: { user_id } });
  }


  public addOrUpdateApplicationReq(row: ITableDataRow, formAction: FormEnum): Observable<ITableSaveRequest> {
    const payload = this.userPayload(row) as ITableDataRow;

    // Use the new config service to determine the endpoint
    const endpoint = formAction === FormEnum.add
      ? this.apiConfig.internal.jobSearch.addApplication
      : this.apiConfig.internal.jobSearch.updateApplication;

    const url = this.apiConfig.getJobSearchUrl(endpoint);
    return this.http.post<ITableSaveRequest>(url, { ...payload });
  }

  public removeRowsReq(rows: ITableDataRow[], formAction: string): Observable<ITableDataRow[]> {
    const payload = this.userPayload(rows);
    // Use the new config service for remove endpoint
    const url = this.apiConfig.getJobSearchUrl(this.apiConfig.internal.jobSearch.removeRows);
    return this.http.post<ITableDataRow[]>(url, payload);
  }

  // MCP Endpoint //
  public mcpRequest(req: IMCPRequest) {
    const request: IMCPRequest = {
      input: req.input = "checking everything works....",
      model: 'gpt-4'
    }
    // To make an actual HTTP request for MCP:
    // const url = this.apiConfig.buildInternalUrl('mcp', '/request');
    // return this.http.post(url, request);
  }

  private userPayload(formRow: ITableDataRow | ITableDataRow[]): ITableDataRow {
    const payload = {
      ...formRow,
      userId: this.currentUserData$().userId
    } as ITableDataRow;
    return payload;
  }
}
