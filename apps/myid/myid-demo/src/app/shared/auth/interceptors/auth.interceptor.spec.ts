import { HttpErrorResponse, HttpStatusCode, provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { myIdDemoAuthInterceptorFn } from './auth.interceptor';

describe('myIdDemoAuthInterceptorFn', () => {
  let loginServiceMock: any;
  let routerMock: any;
  let reqMock: any;
  let nextMock: any;

  beforeEach(() => {
    loginServiceMock = { logout: jest.fn() };
    routerMock = { url: '/login-jwt', navigate: jest.fn() };
    reqMock = { context: { get: jest.fn(() => false) } } as any;
    nextMock = jest.fn();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LoginService, useValue: loginServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
  });

  const runInterceptor = (errorResponse: Partial<HttpErrorResponse>, routerUrl = '/login-jwt') => {
    routerMock.url = routerUrl;
    nextMock.mockReturnValueOnce(throwError(() => errorResponse));
    return TestBed.runInInjectionContext(() =>
      myIdDemoAuthInterceptorFn(reqMock, nextMock)
    );
  };

  it('should be created', () => {
    expect(myIdDemoAuthInterceptorFn).toBeTruthy();
  });

  it('should pass through non-auth errors', (done) => {
    const error = { status: 500 } as HttpErrorResponse;
    nextMock.mockReturnValueOnce(throwError(() => error));
    runInterceptor(error).subscribe({
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });
  });

  it('should swallow auth errors on allow-anonymous pages', (done) => {
    const error = { status: HttpStatusCode.Unauthorized } as HttpErrorResponse;
    runInterceptor(error, '/login-jwt').subscribe({
      complete: () => {
        expect(loginServiceMock.logout).not.toHaveBeenCalled();
        expect(routerMock.navigate).not.toHaveBeenCalled();
        done();
      }
    });
  });

  it('should handle unauthorized error on protected page', (done) => {
    const error = { status: HttpStatusCode.Unauthorized } as HttpErrorResponse;
    runInterceptor(error, '/protected-page').subscribe({
      error: () => {
        expect(loginServiceMock.logout).toHaveBeenCalled();
        expect(routerMock.navigate).toHaveBeenCalled();
        done();
      }
    });
  });

  it('should handle forbidden error on protected page', (done) => {
    const error = { status: HttpStatusCode.Forbidden } as HttpErrorResponse;
    runInterceptor(error, '/protected-page').subscribe({
      error: () => {
        // expect(loginServiceMock.logout).not.toHaveBeenCalled();
        expect(routerMock.navigate).toHaveBeenCalled();
        done();
      }
    });
  });

  it('should bypass interceptor if BYPASS_AUTH_INTERCEPTOR_CTX_TKN is set', (done) => {
    reqMock.context.get = jest.fn(() => true);
    nextMock.mockReturnValueOnce(of('ok'));
    TestBed.runInInjectionContext(() =>
      myIdDemoAuthInterceptorFn(reqMock, nextMock)
    ).subscribe((result) => {
      expect(result).toBe('ok');
      done();
    });
  });
});
