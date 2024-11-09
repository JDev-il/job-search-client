import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

export const loadGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const isLogin = state.url.substring(1) === 'login'
  const isRegister = state.url.substring(1) === 'register'
  if (isRegister) {
    return true;
  }
  if (typeof localStorage !== 'undefined') {
    const router = inject(Router);
    const token = localStorage.getItem('authToken');
    const isToken = token === 'TEST';
    if (isLogin && isToken)
      return router.navigate(['']);
  }
  return true;
};
