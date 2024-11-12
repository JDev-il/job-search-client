import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserLogin, UserResponse } from '../models/users.interface';
import { UserRequest } from './../models/users.interface';
import { AuthService } from './auth.service';


@Injectable({ providedIn: 'root' })
export class ApiService {

  private env = environment.apiUrls;
  constructor(private http: HttpClient, private authService: AuthService) {
  }

  public loginUserRequest(userLoginForm: UserLogin): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.env.local}${this.env.params.users.path}?email=${userLoginForm.email}`);
  }

  public addNewUserRequest(user: UserRequest): Observable<UserRequest> {
    return this.http.post<UserRequest>(`${this.env.local}${this.env.params.users.path}${this.env.params.users.add}`, user).pipe(take(1));
  }
}
