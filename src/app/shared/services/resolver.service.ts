import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthUserResponse, UserLogin } from '../../core/models/users.interface';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from './data.service';
import { RoutingService } from './routing.service';

@Injectable({ providedIn: 'root' })
export class AuthResolver implements Resolve<UserLogin | null> {
  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private routingService: RoutingService
  ) { }

  resolve(): Observable<UserLogin | null> {
    return this.dataService.verifyUserToken().pipe(
      tap((user: UserLogin) => {
        const userRes = {
          email: user.email,
          password: user.password
        } as AuthUserResponse;
        this.dataService.usersResponseState = userRes;
      }),
      catchError(() => {
        return this.onError();
      })
    );
  }

  private onError(): Observable<null> {
    this.authService.logout();
    this.routingService.toLogin();
    return throwError(() => null);
  }
}
