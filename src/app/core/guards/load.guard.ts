import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loadGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const isAuth = authService.isAuthenticated;
  const isLogin = ['login'].includes(state.url.substring(1));
  if (isAuth && isLogin) {
    return router.createUrlTree(['']);
  }
  return true;
};
