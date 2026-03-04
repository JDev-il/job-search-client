import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { AuthorizedUser, AuthUserResponse } from '../../core/models/users.interface';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from './data.service';
import { RoutingService } from './routing.service';

@Injectable({ providedIn: 'root' })
export class AuthResolver implements Resolve<AuthorizedUser | null> {
  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private routingService: RoutingService
  ) { }

  resolve(): Observable<AuthorizedUser | null> {
    return this.dataService.verifyUserToken().pipe(
      tap((user: AuthorizedUser) => {
        const userRes = {
          email: user.email
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
    return EMPTY;
  }
}
