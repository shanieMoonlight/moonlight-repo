import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { LoginCkiStateService } from './login-cki.state.service';
import { MYID_HAS_GOOGLE, MYID_HAS_FACEBOOK, MYID_HAS_AMAZON } from '@spider-baby/myid-auth/config';
import { AccountIoService } from '@spider-baby/myid-io';
import { LoginService } from '@spider-baby/myid-auth/services';
import { PLATFORM_ID } from '@angular/core';

const mockActRoute = {
  queryParamMap: of({ get: () => null }),
  data: of({ showSocialLinks: true })
}

describe('LoginCkiStateService', () => {
  let service: LoginCkiStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: mockActRoute },
        // lightweight mocks for injected services
        { provide: AccountIoService, useValue: { forgotPassword: jest.fn() } },
        { provide: LoginService, useValue: { loginCookie: jest.fn(), loginGoogleCookie: jest.fn(), loginFacebookCookie: jest.fn(), loginAmazonCookie: jest.fn() } },
        LoginCkiStateService
      ]
    });
    service = TestBed.inject(LoginCkiStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('computes show signals when tokens present and running in browser', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: { queryParamMap: of({ get: () => null }), data: of({ showSocialLinks: true }) } },
        { provide: AccountIoService, useValue: { forgotPassword: jest.fn() } },
        { provide: LoginService, useValue: { loginCookie: jest.fn(), loginGoogleCookie: jest.fn(), loginFacebookCookie: jest.fn(), loginAmazonCookie: jest.fn() } },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: MYID_HAS_GOOGLE, useValue: true },
        { provide: MYID_HAS_FACEBOOK, useValue: false },
        { provide: MYID_HAS_AMAZON, useValue: true },
        LoginCkiStateService
      ]
    });

    const s = TestBed.inject(LoginCkiStateService);
    expect(s.canShowSocial()).toBe(true);
    expect(s.showGoogleLogin()).toBe(true);
    expect(s.showFacebookLogin()).toBe(false);
    expect(s.showAmazonLogin()).toBe(true);
  });

  it('hides social buttons on server even when tokens present', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: { queryParamMap: of({ get: () => null }), data: of({ showSocialLinks: true }) } },
        { provide: AccountIoService, useValue: { forgotPassword: jest.fn() } },
        { provide: LoginService, useValue: { loginCookie: jest.fn(), loginGoogleCookie: jest.fn(), loginFacebookCookie: jest.fn(), loginAmazonCookie: jest.fn() } },
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: MYID_HAS_GOOGLE, useValue: true },
        LoginCkiStateService
      ]
    });

    const s = TestBed.inject(LoginCkiStateService);
    expect(s.canShowSocial()).toBe(false);
    expect(s.showGoogleLogin()).toBe(false);
  });

});


//#############################//


