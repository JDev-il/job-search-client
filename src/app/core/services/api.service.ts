import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserLogin, UserResponse, UserToken } from '../models/users.interface';
import { UserRequest } from './../models/users.interface';



@Injectable({ providedIn: 'root' })
export class ApiService {

  private env = environment.apiUrls;
  private authParams = this.env.params.auth;
  private usersParams = this.env.params.users;
  public currentUserRequest$ = signal<UserLogin>(<UserLogin>{})

  constructor(private http: HttpClient) { }

  public addNewUserRequest(user: UserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.env.local}${this.usersParams.path}${this.usersParams.add}`, user);
  }

  public loginUserRequest(userLoginForm: UserLogin): Observable<UserLogin> {
    return of(userLoginForm).pipe(
      switchMap(form => {
        const loginData = form.auth_token
          ? { ...form }
          : { email: form.email, password: form.password };

        const headers = form.auth_token
          ? { Authorization: `Bearer ${form.auth_token}` }
          : null;

        console.log(headers);

        return this.http.post<UserLogin>(
          `${this.env.local}${this.authParams.path}${this.authParams.login}`,
          loginData,
          headers ? { headers } : {}
        );
      })
    );
    // let loginData = <UserLogin>{}
    // if (userLoginForm.auth_token) {
    //   const headers = {
    //     Authorization: `Bearer ${userLoginForm.auth_token}`
    //   }
    //   loginData = { ...userLoginForm }
    //   return this.http.post<UserLogin>(`${this.env.local}${this.authParams.path}${this.authParams.login}`, loginData, { headers: headers });
    // }
    // loginData = { email: userLoginForm.email, password: userLoginForm.password };
    // return this.http.post<UserLogin>(`${this.env.local}${this.authParams.path}${this.authParams.login}`, loginData);
  }

  public verifyToken(token: string): Observable<string> {
    return this.http.get<string>(`${this.env.local}${this.authParams.path}${this.authParams.verify}`, { headers: { 'authorization': `Bearer ${token}` } });
  }

  public generateToken(user: UserLogin): Observable<UserToken> {
    return this.http.post<UserToken>(`${this.env.local}${this.env.params.auth.path}${this.env.params.auth.sign}`, user, { responseType: 'json' });
  }
}
