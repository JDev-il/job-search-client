import { HttpErrorResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ApiConfigService } from '../services/configuration.service';
import { RoutingService } from '../../shared/services/routing.service';
import { authErrorInterceptor, authTokenInterceptor } from './auth.interceptor';

describe('authTokenInterceptor', () => {
  // No DI deps of its own (just reads `environment`), so this can be built
  // directly to compute expected URLs without touching TestBed at all.
  const apiConfig = new ApiConfigService();

  function configure(token: string | null): void {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: { getToken: () => token } as Partial<AuthService> }],
    });
  }

  it('attaches Authorization to a request aimed at our own API when a token exists', () => {
    configure('my-token');
    const internalUrl = apiConfig.getJobSearchUrl(apiConfig.internal.jobSearch.getApplications);
    const req = new HttpRequest('GET', internalUrl);
    const next = jasmine.createSpy('next').and.callFake((r: HttpRequest<unknown>) => {
      expect(r.headers.get('authorization')).toBe('Bearer my-token');
      return of({} as any);
    });
    TestBed.runInInjectionContext(() => authTokenInterceptor(req, next));
    expect(next).toHaveBeenCalled();
  });

  it('does NOT attach a token to an external (third-party) request', () => {
    configure('my-token');
    const req = new HttpRequest('GET', apiConfig.external.companies.baseUrl + 'companies');
    const next = jasmine.createSpy('next').and.callFake((r: HttpRequest<unknown>) => {
      expect(r.headers.has('authorization')).toBeFalse();
      return of({} as any);
    });
    TestBed.runInInjectionContext(() => authTokenInterceptor(req, next));
    expect(next).toHaveBeenCalled();
  });

  it('does not overwrite an Authorization header a call site already set', () => {
    configure('my-token');
    const internalUrl = apiConfig.getAuthUrl(apiConfig.internal.auth.openAiCredentials);
    const req = new HttpRequest('POST', internalUrl, {}, { headers: new HttpHeaders({ authorization: 'Bearer explicit' }) });
    const next = jasmine.createSpy('next').and.callFake((r: HttpRequest<unknown>) => {
      expect(r.headers.get('authorization')).toBe('Bearer explicit');
      return of({} as any);
    });
    TestBed.runInInjectionContext(() => authTokenInterceptor(req, next));
    expect(next).toHaveBeenCalled();
  });

  it('does nothing when there is no stored token', () => {
    configure(null);
    const internalUrl = apiConfig.getJobSearchUrl(apiConfig.internal.jobSearch.getApplications);
    const req = new HttpRequest('GET', internalUrl);
    const next = jasmine.createSpy('next').and.callFake((r: HttpRequest<unknown>) => {
      expect(r.headers.has('authorization')).toBeFalse();
      return of({} as any);
    });
    TestBed.runInInjectionContext(() => authTokenInterceptor(req, next));
    expect(next).toHaveBeenCalled();
  });
});

describe('authErrorInterceptor', () => {
  let apiConfig: ApiConfigService;
  let logoutSpy: jasmine.Spy;
  let toLoginSpy: jasmine.Spy;

  beforeEach(() => {
    logoutSpy = jasmine.createSpy('logout');
    toLoginSpy = jasmine.createSpy('toLogin');
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { logout: logoutSpy } },
        { provide: RoutingService, useValue: { toLogin: toLoginSpy } },
      ],
    });
    apiConfig = TestBed.inject(ApiConfigService);
  });

  it('logs out and redirects to login on a 401 from a protected endpoint', (done) => {
    const req = new HttpRequest('GET', apiConfig.getJobSearchUrl(apiConfig.internal.jobSearch.getApplications));
    const next = () => throwError(() => new HttpErrorResponse({ status: 401 }));
    TestBed.runInInjectionContext(() => authErrorInterceptor(req, next)).subscribe({
      error: () => {
        expect(logoutSpy).toHaveBeenCalled();
        expect(toLoginSpy).toHaveBeenCalled();
        done();
      },
    });
  });

  it('does NOT logout/redirect on a 401 from /auth/login (that is "wrong credentials", not "session expired")', (done) => {
    const req = new HttpRequest('POST', apiConfig.getAuthUrl(apiConfig.internal.auth.login), {});
    const next = () => throwError(() => new HttpErrorResponse({ status: 401 }));
    TestBed.runInInjectionContext(() => authErrorInterceptor(req, next)).subscribe({
      error: () => {
        expect(logoutSpy).not.toHaveBeenCalled();
        expect(toLoginSpy).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('does NOT logout/redirect on a 401 from /auth/signtoken', (done) => {
    const req = new HttpRequest('POST', apiConfig.getAuthUrl(apiConfig.internal.auth.sign), {});
    const next = () => throwError(() => new HttpErrorResponse({ status: 401 }));
    TestBed.runInInjectionContext(() => authErrorInterceptor(req, next)).subscribe({
      error: () => {
        expect(logoutSpy).not.toHaveBeenCalled();
        expect(toLoginSpy).not.toHaveBeenCalled();
        done();
      },
    });
  });

  it('passes non-401 errors through untouched', (done) => {
    const req = new HttpRequest('GET', apiConfig.getJobSearchUrl(apiConfig.internal.jobSearch.getApplications));
    const next = () => throwError(() => new HttpErrorResponse({ status: 500 }));
    TestBed.runInInjectionContext(() => authErrorInterceptor(req, next)).subscribe({
      error: (err: HttpErrorResponse) => {
        expect(err.status).toBe(500);
        expect(logoutSpy).not.toHaveBeenCalled();
        done();
      },
    });
  });
});
