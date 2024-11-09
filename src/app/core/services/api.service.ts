import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserLogin, UserResponse } from '../models/users.interface';
import { UserRequest } from './../models/users.interface';
import { AuthService } from './auth.service';


@Injectable({ providedIn: 'root' })
export class ApiService {

  private newUserRequest$ = signal<UserRequest>(<UserRequest>{});
  private userLoginRequest$ = signal<UserLogin>(<UserLogin>{});
  private usersResponse$ = signal<UserResponse[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  public loginUserRequest(userLoginForm: UserLogin): void | Error {
    console.log("checking token...");
    console.log("this.authService.isAuthenticated");

    this.userLoginRequest$.set(userLoginForm);
    const id = 1;
    const env = environment.apiUrls;
    this.http.post<UserLogin>(`${env.local}${env.params.users}${id}`, { userLoginForm })
      .pipe(catchError(error => {
        console.error('Login failed', error);
        return of(null);
      }))
      .subscribe(console.log);
  }

  public addNewUserRequest(user: UserRequest): void {
    this.newUserRequest$.set(user);
    this.http.post<UserRequest>('http://192.168.68.56:3000/users', user)
      .pipe(catchError(error => {
        console.error('User creation failed', error);
        return of(null);
      }))
      .subscribe((res) => {
        if (res) console.log('New user response:', res);
      });
  }

  // Public accessors
  public get userLoginRequest() {
    return this.userLoginRequest$();
  }

  public get newUserRequest() {
    return this.newUserRequest$();
  }
}


//! continue using local nest.js (http://192.168.68.56:3000)
//! http://100.123.163.126:3000???
// this.usersResponse$.set([{ id: 2, age: 22, email: 'test@test.com', name: 'Leo', password: 'ffgf' }])
