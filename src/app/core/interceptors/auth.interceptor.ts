import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ApiConfigService } from '../services/configuration.service';
import { RoutingService } from '../../shared/services/routing.service';

/**
 * Attaches `Authorization: Bearer <token>` to every request aimed at our own
 * backend. Several call sites (gmail-api.service.ts, api.service.ts's
 * mcpRequest/verifyTokenReq/generateTokenReq) already set this header
 * themselves — those are left untouched. This only fills it in where it was
 * previously missing entirely (jobsearch, users/user), which is exactly what
 * started failing once the backend started requiring it.
 *
 * Scoped to our internal API base so the token is never sent to the
 * external mock/geo APIs this app also calls.
 */
export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const apiConfig = inject(ApiConfigService);

  const internalBase = apiConfig.internal.base.endsWith('/')
    ? apiConfig.internal.base.slice(0, -1)
    : apiConfig.internal.base;

  const token = authService.getToken();
  const isInternalCall = req.url.startsWith(internalBase);

  if (token && isInternalCall && !req.headers.has('authorization')) {
    req = req.clone({ setHeaders: { authorization: `Bearer ${token}` } });
  }

  return next(req);
};

/**
 * On a 401 from our backend, treat it as "the session is no longer valid":
 * clear the stored token and send the user back to login. This did not
 * exist before — every one of the newly-guarded calls would otherwise fail
 * silently or leave stale UI state instead of recovering.
 *
 * /auth/login and /auth/signtoken are excluded: a 401 there means "wrong
 * credentials", which the login/registration components already surface
 * with their own snackbar — redirecting on top of that would just stomp on
 * that message.
 */
export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const routingService = inject(RoutingService);
  const apiConfig = inject(ApiConfigService);

  const credentialEndpoints = [
    apiConfig.getAuthUrl(apiConfig.internal.auth.login),
    apiConfig.getAuthUrl(apiConfig.internal.auth.sign),
  ];

  return next(req).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !credentialEndpoints.includes(req.url)
      ) {
        authService.logout();
        routingService.toLogin();
      }
      return throwError(() => error);
    }),
  );
};
