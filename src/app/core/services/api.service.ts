import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { map, Observable, of, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Country } from '../models/data.interface';
import { ContinentsEnum, FormEnum } from '../models/enum/utils.enum';
import { UserLogin, UserResponse, UserToken } from '../models/users.interface';
import { ITableDataRow, ITableSaveRequest } from './../models/table.interface';
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

  public authUserDataReq(): Observable<ITableDataRow[]> { // After user is authenticated
    const user_id = this.currentUserData$()?.userId;
    return this.http.get<ITableDataRow[]>(`${this.env.local}${this.jobSearchParams.path}${this.jobSearchParams.getApplications}`, { params: { user_id } }
    )
  }

  public addOrUpdateApplicationReq(row: ITableDataRow, formAction: FormEnum): Observable<ITableSaveRequest> {
    const payload = this.userPayload(row, formAction) as ITableDataRow;
    const addOrEdit = formAction === FormEnum.add ? this.jobSearchParams.addApplication : this.jobSearchParams.updateApplication;
    return this.http.post<ITableSaveRequest>(`${this.env.local}${this.jobSearchParams.path}${addOrEdit}`, { ...payload });
  }

  public removeRowsReq(rows: ITableDataRow[], formAction: string): Observable<ITableDataRow[]> {
    const payload = this.userPayload(rows, formAction);
    return this.http.post<ITableDataRow[]>(`${this.env.local}${this.jobSearchParams.path}${this.jobSearchParams.removeRows}`, payload);
  }

  public updateApplicationListReq(applicationList: ITableDataRow | ITableDataRow[]): Observable<ITableDataRow[]> {
    return this.http.post<ITableDataRow[]>(`${this.env.local}${this.jobSearchParams.path}${this.jobSearchParams.updateApplication}`, applicationList);
  }

  private userPayload(formRow: ITableDataRow | ITableDataRow[], formAction: string): ITableDataRow {
    let payload = {
      ...formRow,
      userId: this.currentUserData$().userId
    } as ITableDataRow;
    return payload;
  }
}

