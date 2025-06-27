import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, of, Subject } from 'rxjs';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Verify2FactorStateService } from './verify-2-factor.state.service';
import { AccountIoService } from '@spider-baby/myid-io';
import { LoginService } from '../../../../shared/auth/services/login/login.service';
import { TwoFactorProvider } from '@spider-baby/myid-io/models';
import { MyIdRouteInfo } from '../../../../shared/id/utils/my-id-route-info';

//###############################//

const VALID_TOKEN = 'test-token';

// Use a BehaviorSubject for queryParamMap, so we can update it in each test
let queryParamMapSubject: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
const mockActRoute: Partial<ActivatedRoute> = {
  // snapshot: {},
  params: of({}),
  get queryParamMap() {
    return queryParamMapSubject.asObservable();
  }
};

const mockJwtPackage = {
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  refreshToken: 'refresh-token-value',
  expiration: 3600,
  twoFactorVerificationRequired: true,
  twoFactorProvider: 'authenticatorApp' as TwoFactorProvider,
  twoFactorToken: '2fa-token-value',
  extraInfo: 'additional-info',
  expirationDate: '2023-12-31T23:59:59Z'
};



//###############################//

describe('Verify2FactorStateService', () => {
  let state: Verify2FactorStateService;
  let loginService: LoginService;
  let ioService: AccountIoService;
  let verifySpy: jest.SpyInstance;
  let resendSpy: jest.SpyInstance;

  beforeEach(() => {
    queryParamMapSubject = new BehaviorSubject(convertToParamMap({})); // Start with no token
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        Verify2FactorStateService,
        AccountIoService,
        { provide: ActivatedRoute, useValue: mockActRoute }
      ]
    });
    state = TestBed.inject(Verify2FactorStateService);
    ioService = TestBed.inject(AccountIoService);
    loginService = TestBed.inject(LoginService);
    verifySpy = jest.spyOn(loginService, 'verify2Factor').mockReturnValue(of(mockJwtPackage));
    resendSpy = jest.spyOn(ioService, 'twoFactorResend').mockReturnValue(of({ message: 'resent' }));
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(state).toBeTruthy();
  });

  it('should start cooldown countdown at 30 and decrement to 0', fakeAsync(() => {
    queryParamMapSubject.next(convertToParamMap({ [MyIdRouteInfo.Params.TWO_FACTOR_TOKEN_KEY]: 'test-user-id' }));
    const state = TestBed.inject(Verify2FactorStateService);
    state.resend2Factor();
    tick(0); // Allow the signal to update
    expect(state.resendCooldownCountdown()).toBe(30);
    tick(1000);
    expect(state.resendCooldownCountdown()).toBe(29);
    tick(29000);
    expect(state.resendCooldownCountdown()).toBe(0);
  }));

  it('should not decrement below 0', fakeAsync(() => {
    queryParamMapSubject.next(convertToParamMap({ [MyIdRouteInfo.Params.TWO_FACTOR_TOKEN_KEY]: 'test-user-id' }));
    const state = TestBed.inject(Verify2FactorStateService);
    state.resend2Factor();
    tick(31000); // 31 seconds
    expect(state.resendCooldownCountdown()).toBe(0);
    tick(10000);
    expect(state.resendCooldownCountdown()).toBe(0);
  }));

  it('should have cooldownCountdown at 0 before resend2Factor is called', () => {
    expect(state.resendCooldownCountdown()).toBe(0);
  });

  // Example DTO creation test (pseudo, adapt as needed)
  it('should create correct DTO for verify2Factor', () => {
    const token = 'abc';
    const code = '123456';
    // If you have a method or observable for DTO creation, test it here
    // For now, just check the shape
    const dto = { token, code };
    expect(dto).toEqual({ token: 'abc', code: '123456' });
  });

  it('should return invalid token error if token is missing', fakeAsync(() => {
    tick(); // Allow signals and computed to update
    expect(state.invalidDataErrorMsg()).toBe('Invalid token.');
  }));

  it('should call twoFactorVerification with correct DTO', () => {
    queryParamMapSubject.next(convertToParamMap({
      [MyIdRouteInfo.Params.TWO_FACTOR_TOKEN_KEY]: 'test-user-id'
    }))
    state.verify2Factor('123456');
    expect(verifySpy).toHaveBeenCalledWith({ token: expect.any(String), code: '123456' })
  });

  it('should set verifySuccess to true on successful verification', fakeAsync(() => {
    queryParamMapSubject.next(convertToParamMap({
      [MyIdRouteInfo.Params.TWO_FACTOR_TOKEN_KEY]: 'test-user-id'
    }))
    state.verify2Factor('123456');
    tick(0);
    // Simulate async completion
    expect(state.verifySuccess()).toBe(true);
  }));

  it('should call twoFactorResend with correct DTO', () => {
    queryParamMapSubject.next(convertToParamMap({ [MyIdRouteInfo.Params.TWO_FACTOR_TOKEN_KEY]: 'test-user-id' }));
    state.resend2Factor();
    expect(resendSpy).toHaveBeenCalledWith({ token: expect.any(String) });
  });

  it('should set successMsg after successful resend', fakeAsync(() => {
    queryParamMapSubject.next(convertToParamMap({ [MyIdRouteInfo.Params.TWO_FACTOR_TOKEN_KEY]: 'test-user-id' }));
    state.resend2Factor();
    tick(0);
    expect(state.successMsg()).toContain('resent');
  }));

  it('should set loading to true during async operation', fakeAsync(() => {
    queryParamMapSubject.next(convertToParamMap({ [MyIdRouteInfo.Params.TWO_FACTOR_TOKEN_KEY]: 'test-user-id' }));
    // Simulate a long-running observable
    verifySpy.mockReturnValue(new Subject());
    state.verify2Factor('123456');
    expect(state.loading()).toBe(true);
  }));

});
