import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RefreshTokenService } from '@spider-baby/auth-signal/refresh';
import { AccountIoService } from '@spider-baby/myid-io';
import { of, Subject, throwError } from 'rxjs';
import { MyIdAuthService } from '../auth/myid.auth.browser.service';
import { LoginService } from './login.service';

const mockAuth = { logIn: jest.fn(), logOut: jest.fn() };
const mockAccIoService = {
  login: jest.fn(),
  loginRefresh: jest.fn(),
  cookieSignIn: jest.fn(),
  googleLogin: jest.fn(),
  googleCookieSignin: jest.fn(),
  twoFactorVerification: jest.fn(),
  twoFactorVerificationCookie: jest.fn(),
};
const mockRefreshService = {
  refresh$: new Subject<any>(),
  setRefreshState: jest.fn(),
  clearRefreshState: jest.fn(),
};

jest.mock('../auth/myid.auth.browser.service', () => ({
  MyIdAuthService: jest.fn(() => mockAuth),
}));
jest.mock('@spider-baby/myid-io', () => ({
  AccountIoService: jest.fn(() => mockAccIoService),
}));
jest.mock('@spider-baby/auth-signal/refresh', () => ({
  RefreshTokenService: jest.fn(() => mockRefreshService),
}));

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {
    jest.clearAllMocks();


    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: AccountIoService, useValue: mockAccIoService },
        { provide: MyIdAuthService, useValue: mockAuth },
        { provide: RefreshTokenService, useValue: mockRefreshService },
        LoginService,
      ],
    });

    TestBed.runInInjectionContext(() => {
      service = TestBed.inject(LoginService);
    });

  });

  it('should call logIn and setRefreshState on successful loginJwt', (done) => {
    const jwt = { accessToken: 'token', refreshToken: 'rt', expiration: 123 };
    mockAccIoService.login.mockReturnValue(of(jwt));
    service.loginJwt({} as any).subscribe((result) => {
      expect(mockAuth.logIn).toHaveBeenCalledWith('token');
      expect(mockRefreshService.setRefreshState).toHaveBeenCalledWith({
        refreshToken: 'rt',
        expiration: 123,
      });
      expect(result).toBe(jwt);
      done();
    });
  });

  it('should call logIn and setRefreshState on successful refreshJwt', (done) => {
    const jwt = { accessToken: 'token', refreshToken: 'rt', expiration: 123 };
    mockAccIoService.loginRefresh.mockReturnValue(of(jwt));
    service.refreshJwt('rt').subscribe((result) => {
      expect(mockAuth.logIn).toHaveBeenCalledWith('token');
      expect(mockRefreshService.setRefreshState).toHaveBeenCalledWith({
        refreshToken: 'rt',
        expiration: 123,
      });
      expect(result).toBe(jwt);
      done();
    });
  });

  it('should call logOut and clearRefreshState on logout', () => {
    service.logout();
    expect(mockAuth.logOut).toHaveBeenCalled();
    expect(mockRefreshService.clearRefreshState).toHaveBeenCalled();
  });

  it('should call logOut on login error', (done) => {
    mockAccIoService.login.mockReturnValue(throwError(() => new Error('fail')));
    service.loginJwt({} as any).subscribe({
      error: (err) => {
        expect(mockAuth.logOut).toHaveBeenCalled();
        expect(err).toBeInstanceOf(Error);
        done();
      },
    });
  });

  it('should call logIn and setRefreshState on refresh$ event', (done) => {
    const jwt = { accessToken: 'token', refreshToken: 'rt', expiration: 123 };
    mockAccIoService.loginRefresh.mockReturnValue(of(jwt));
    mockRefreshService.refresh$.next({ refreshToken: 'rt', expiration: 123 });
    setTimeout(() => {
      expect(mockAuth.logIn).toHaveBeenCalledWith('token');
      expect(mockRefreshService.setRefreshState).toHaveBeenCalledWith({
        refreshToken: 'rt',
        expiration: 123,
      });
      done();
    }, 0);
  });
});