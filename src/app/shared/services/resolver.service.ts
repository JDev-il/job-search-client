import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';
import { UserLogin } from '../../core/models/users.interface';
import { AuthService } from '../../core/services/auth.service';
import { StateService } from '../services/state.service';
import { RoutingService } from './routing.service';

@Injectable({ providedIn: 'root' })
export class AuthResolver implements Resolve<UserLogin | null> {
  constructor(
    private stateService: StateService,
    private authService: AuthService,
    private routingService: RoutingService
  ) { }

  resolve(): Observable<UserLogin | null> {
    if (!this.authService.isAuthenticated) {
      return this.onError();
    }
    return this.stateService.verifyUserToken().pipe(
      tap((user: UserLogin) => {
        const userRes = { email: user.email, password: user.password };
        this.stateService.usersResponseState = userRes;
        this.stateService.spinnerState = false;
        this.stateService.destroy$.next(false);
      }),
      catchError(() => {
        return this.onError();
      })
    );
  }

  private onError(): Observable<null> {
    this.authService.logout();
    this.routingService.toLogin();
    return of(null);
  }
}
