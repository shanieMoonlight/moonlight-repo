import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginJwtStateService } from './login-jwt.state.service';
import { MyIdRouter } from '@spider-baby/myid-auth/config';
import { MYID_HAS_GOOGLE, MYID_HAS_FACEBOOK, MYID_HAS_AMAZON } from '@spider-baby/myid-auth/config';
import { AccountIoService } from '@spider-baby/myid-io';
import { LoginService } from '@spider-baby/myid-auth/services';
import { PLATFORM_ID } from '@angular/core';
import { PreconditionRequiredError } from '@spider-baby/myid-io';
import { JwtPackage } from '@spider-baby/myid-io/models';

//#############################//

const mockRouter = {
  navigateToLogin: jest.fn(),
};

const mockActRoute = {
  queryParamMap: of({ get: () => null }),
  data: of({ get: () => null })
}

//#############################//

describe('LoginJwtStateService', () => {
  let service: LoginJwtStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActRoute },
        { provide: MyIdRouter, useValue: mockRouter },
        // provide lightweight mocks for injected services
        { provide: AccountIoService, useValue: { forgotPassword: jest.fn() } },
        { provide: LoginService, useValue: { loginJwt: jest.fn(), loginGoogleJwt: jest.fn(), loginFacebookJwt: jest.fn(), loginAmazonJwt: jest.fn() } },
        LoginJwtStateService
      ]
    });
    service = TestBed.inject(LoginJwtStateService);
  });

  //- - - - - - - - - - - - - //

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //- - - - - - - - - - - - - //

  it('computes show signals when tokens present and running in browser', () => {
    // Reconfigure TestBed with tokens present and PLATFORM_ID='browser' and showSocialLinks true
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: { queryParamMap: of({ get: () => null }), data: of({ showSocialLinks: true }) } },
        { provide: MyIdRouter, useValue: mockRouter },
        { provide: AccountIoService, useValue: { forgotPassword: jest.fn() } },
        { provide: LoginService, useValue: { loginJwt: jest.fn(), loginGoogleJwt: jest.fn(), loginFacebookJwt: jest.fn(), loginAmazonJwt: jest.fn() } },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: MYID_HAS_GOOGLE, useValue: true },
        { provide: MYID_HAS_FACEBOOK, useValue: false },
        { provide: MYID_HAS_AMAZON, useValue: true },
        LoginJwtStateService
      ]
    });

    const s = TestBed.inject(LoginJwtStateService);
    expect(s.canShowSocial()).toBe(true);
    expect(s.showGoogleLogin()).toBe(true);
    expect(s.showFacebookLogin()).toBe(false);
    expect(s.showAmazonLogin()).toBe(true);
  });

  //- - - - - - - - - - - - - //

  it('hides social buttons on server even when tokens present', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: { queryParamMap: of({ get: () => null }), data: of({ showSocialLinks: true }) } },
        { provide: MyIdRouter, useValue: mockRouter },
        { provide: AccountIoService, useValue: { forgotPassword: jest.fn() } },
        { provide: LoginService, useValue: { loginJwt: jest.fn(), loginGoogleJwt: jest.fn(), loginFacebookJwt: jest.fn(), loginAmazonJwt: jest.fn() } },
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: MYID_HAS_GOOGLE, useValue: true },
        LoginJwtStateService
      ]
    });

    const s = TestBed.inject(LoginJwtStateService);
    expect(s.canShowSocial()).toBe(false);
    expect(s.showGoogleLogin()).toBe(false);
  });




  it('reads redirectUrl from query param', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: { queryParamMap: of({ get: () => 'https://example.com/return' }), data: of({ showSocialLinks: false }) } },
        { provide: MyIdRouter, useValue: mockRouter },
        { provide: AccountIoService, useValue: { forgotPassword: jest.fn() } },
        { provide: LoginService, useValue: { loginJwt: jest.fn(), loginGoogleJwt: jest.fn(), loginFacebookJwt: jest.fn(), loginAmazonJwt: jest.fn() } },
        { provide: PLATFORM_ID, useValue: 'browser' },
        LoginJwtStateService
      ]
    });

  //- - - - - - - - - - - - - //

    const s = TestBed.inject(LoginJwtStateService);
    expect(s.redirectUrl()).toBe('https://example.com/return');
  });

  it('triggers LoginService methods when login* methods are called', async () => {
    TestBed.resetTestingModule();
    const loginMocks = {
      loginJwt: jest.fn().mockReturnValue(of({})),
      loginGoogleJwt: jest.fn().mockReturnValue(of({})),
      loginFacebookJwt: jest.fn().mockReturnValue(of({})),
      loginAmazonJwt: jest.fn().mockReturnValue(of({}))
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: { queryParamMap: of({ get: () => null }), data: of({ showSocialLinks: false }) } },
        { provide: MyIdRouter, useValue: mockRouter },
        { provide: AccountIoService, useValue: { forgotPassword: jest.fn() } },
        { provide: LoginService, useValue: loginMocks },
        { provide: PLATFORM_ID, useValue: 'browser' },
        LoginJwtStateService
      ]
    });

    const s = TestBed.inject(LoginJwtStateService);

    const loginDto = { username: 'u', password: 'p' } as any;
    s.login(loginDto);
    await Promise.resolve();
    expect(loginMocks.loginJwt).toHaveBeenCalledWith(loginDto);

    const gDto = { idToken: 'g' } as any;
    s.loginGoogle(gDto);
    await Promise.resolve();
    expect(loginMocks.loginGoogleJwt).toHaveBeenCalledWith(gDto);

    const fDto = { accessToken: 'f' } as any;
    s.loginFacebook(fDto);
    await Promise.resolve();
    expect(loginMocks.loginFacebookJwt).toHaveBeenCalledWith(fDto);

    const aDto = { accessToken: 'a' } as any;
    s.loginAmazon(aDto);
    await Promise.resolve();
    expect(loginMocks.loginAmazonJwt).toHaveBeenCalledWith(aDto);
  });

  it('sets twoFactorRequired and twoFactorData when LoginService returns PreconditionRequiredError', async () => {
    TestBed.resetTestingModule();

    const payload: JwtPackage = { twoFactorToken: 'tkn', twoFactorProvider: 'sms' } as any;
    const precondErr = new PreconditionRequiredError(undefined, undefined, payload, true);

    const loginMocks = {
      loginJwt: jest.fn(),
      loginGoogleJwt: jest.fn().mockReturnValue(throwError(() => precondErr)),
      loginFacebookJwt: jest.fn(),
      loginAmazonJwt: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: { queryParamMap: of({ get: () => null }), data: of({ showSocialLinks: false }) } },
        { provide: MyIdRouter, useValue: mockRouter },
        { provide: AccountIoService, useValue: { forgotPassword: jest.fn() } },
        { provide: LoginService, useValue: loginMocks },
        { provide: PLATFORM_ID, useValue: 'browser' },
        LoginJwtStateService
      ]
    });

    const s = TestBed.inject(LoginJwtStateService);

    s.loginGoogle({ idToken: 'x' } as any);
    // Allow microtask queue to process promise rejection
    await Promise.resolve();

    expect(s.twoFactorRequired()).toBe(true);
    const data = s.twoFactorData();
    expect(data).toBeDefined();
    expect(data?.token).toBe('tkn');
    expect(data?.provider).toBe('sms');
  });
});
