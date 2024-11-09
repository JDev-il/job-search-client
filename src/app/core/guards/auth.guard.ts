import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('authToken');
    const isToken = token === 'TEST';
    if (isToken) { //! USE JWT AUTHORIZATION!!!!
      return true;
    }
    return router.navigate(['login']);
  }
  return false;
};
