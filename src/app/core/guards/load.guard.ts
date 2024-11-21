import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { StateService } from '../../shared/services/state.service';
import { AuthService } from '../services/auth.service';

export const loadGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const stateService = inject(StateService);
  const isAuth = authService.isAuthenticated;
  const isLoginOrRegister = ['login', 'register'].includes(state.url.substring(1));
  if (isAuth && isLoginOrRegister) {
    return router.createUrlTree(['']);
  }
  return true;
};
