import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Country } from '../models/data.interface';
import { ContinentsEnum, FormEnum } from '../models/enum/utils.enum';
import { ITableDataResponse, ITableRow } from '../models/table.interface';
import { UserLogin, UserResponse, UserToken } from '../models/users.interface';
import { UserRequest } from './../models/users.interface';

@Injectable({ providedIn: 'root' })
export class ApiService {

  private env = environment.apiUrls;
  private authParams = this.env.params.auth;
  private usersParams = this.env.params.users;
  private jobSearchParams = this.env.params.job_search;
  public currentUserData$ = signal<UserResponse>({} as UserResponse);
  public currentUserRequest$ = signal<UserLogin>({} as UserLogin);

  constructor(private http: HttpClient) { }

  public getCountriesListReq(continent: ContinentsEnum): Observable<Country[]> {
    if (continent === ContinentsEnum.AMERICA) {
      return this.http.get<Country[]>(`https://restcountries.com/v3.1/subregion/north%20america`)
    }
    return this.http.get<Country[]>(`https://restcountries.com/v3.1/region/${continent}?fields=name`)
      .pipe(map(data => data
        .sort((a, b) =>
          a.name.common.localeCompare(b.name.common))
      ));
  }

  public addNewUserReq(userData: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.env.local}${this.usersParams.path}${this.usersParams.add}`, userData);
  }

  public loginUserReq(userLoginForm: UserLogin): Observable<UserLogin> {
    return of(userLoginForm).pipe(
      switchMap(form => {
        const loginData = form.auth_token ? { ...form } : { email: form.email, password: form.password };
        const headers = form.auth_token ? { Authorization: `Bearer ${form.auth_token}` } : null;
        return this.http.post<UserLogin>(
          `${this.env.local}${this.authParams.path}${this.authParams.login}`,
          loginData,
          headers ? { headers } : {}
        );
      })
    );
  }

  public verifyTokenReq(token: string): Observable<UserLogin> {
    return this.http.get<UserLogin>(`${this.env.local}${this.authParams.path}${this.authParams.verify}`, { headers: { 'authorization': `Bearer ${token}` } });
  }

  public generateTokenReq(user: UserLogin): Observable<UserToken> {
    return this.http.post<UserToken>(`${this.env.local}${this.env.params.auth.path}${this.env.params.auth.sign}`, user, { responseType: 'json' });
  }

  public getUserDataReq(user_id: string): Observable<UserResponse> {
    return of(user_id).pipe(
      switchMap((id: string) => {
        if (id) {
          return this.http
            .get<UserResponse>(
              `${this.env.local}${this.usersParams.path}${this.usersParams.user}`,
              { params: new HttpParams().append('user_id', id) }
            )
        } else {
          return throwError(() => new Error('User ID is required'));
        }
      }))
  }

  public authUserDataReq(): Observable<ITableDataResponse[]> { // After user is authenticated
    const user_id = this.currentUserData$()?.userId;
    return this.http.get<ITableDataResponse[]>(`${this.env.local}${this.jobSearchParams.path}${this.jobSearchParams.getApplications}`, { params: { user_id } })
  }

  public applicationAddOrEditReq(row: ITableRow, formAction: FormEnum): Observable<ITableDataResponse> {
    const payload = this.userPayload(row, formAction);
    const addOrEdit = formAction === FormEnum.addRow ? this.jobSearchParams.addApplication : this.jobSearchParams.editApplication;
    return this.http.post<ITableDataResponse>(`${this.env.local}${this.jobSearchParams.path}${addOrEdit}`, { ...payload });
  }

  public removeRowReq(row: ITableDataResponse, formAction: FormEnum): Observable<ITableDataResponse> {
    const payload = this.userPayload(row, formAction);
    return this.http.post<ITableDataResponse>(`${this.env.local}${this.jobSearchParams.path}${this.jobSearchParams.removeRow}`, { ...payload });
  }

  public removeRowsReq(rows: ITableDataResponse[], formAction: FormEnum): Observable<ITableDataResponse[]> {
    const payload = this.userPayload(rows, formAction);
    return this.http.post<ITableDataResponse[]>(`${this.env.local}${this.jobSearchParams.path}${this.jobSearchParams.removeRows}`, payload);
  }

  public updateApplicationListReq(applicationList: ITableDataResponse | ITableDataResponse[]): Observable<ITableDataResponse[]> {
    return this.http.post<ITableDataResponse[]>(`${this.env.local}${this.jobSearchParams.path}${this.jobSearchParams.updateApplication}`, applicationList);
  }

  private userPayload(formRow: ITableRow | ITableDataResponse | ITableDataResponse[], formAction: FormEnum) {
    let payload = {
      userId: (formAction === FormEnum.addRow || formAction === FormEnum.editRow) ? this.currentUserData$().userId : '',
      ...formRow
    }
    return payload;
  }
}
