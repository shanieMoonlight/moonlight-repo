/* eslint-disable @typescript-eslint/no-explicit-any */
import { PLATFORM_ID } from '@angular/core';
import { BaseRefreshTokenService, RefreshTokenData } from './base-refresh.service';
import { TestBed } from '@angular/core/testing';

jest.useFakeTimers();

class TestRefreshTokenService extends BaseRefreshTokenService {
  public storedToken: RefreshTokenData | null = null;
  public removed = false;

  protected storeToken(token: RefreshTokenData): Promise<void> {
    this.storedToken = token;
    return Promise.resolve();
  }
  protected removeToken(): Promise<void> {
    this.removed = true;
    this.storedToken = null;
    return Promise.resolve();
  }
  protected getStoredToken(): Promise<RefreshTokenData | null> {
    return Promise.resolve(this.storedToken);
  }
}

describe('BaseRefreshTokenService', () => {
  let service: TestRefreshTokenService;
  const now = Date.now();

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(now);
    
        TestBed.configureTestingModule({
            providers: [
                { provide: PLATFORM_ID, useValue: 'browser' },
                TestRefreshTokenService,
            ],
        });
        service = TestBed.inject(TestRefreshTokenService);
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.restoreAllMocks();
  });

  it('should initialize with undefined state', () => {
    expect(service.state()).toBeUndefined();
  });

  it('should store and emit refresh state', async () => {
    const token: RefreshTokenData = { refreshToken: 'abc', expiration: Math.floor(now / 1000) + 120 };
    service.setRefreshState(token);
    expect(service.state()).toEqual(token);
    expect(service.storedToken).toEqual(token);
  });

  it('should clear state and remove token', async () => {
    const token: RefreshTokenData = { refreshToken: 'abc', expiration: Math.floor(now / 1000) + 120 };
    service.setRefreshState(token);
    service.clearRefreshState();
    expect(service.state()).toBeUndefined();
    expect(service.removed).toBe(true);
    expect(service.storedToken).toBeNull();
  });

  it('should emit on refresh$ when scheduled time arrives', async () => {
    const token: RefreshTokenData = { refreshToken: 'abc', expiration: Math.floor(now / 1000) + 2 };
    const spy = jest.fn();
    service.refresh$.subscribe(spy);
    service.setRefreshState(token);

    // Fast-forward until the timer triggers
    jest.advanceTimersByTime(1000 * 2); // TimeInMillis.Minute is subtracted in scheduleRefresh
    expect(spy).toHaveBeenCalledWith(token);
  });

  it('should emit immediately if expiration is in the past', async () => {
    const token: RefreshTokenData = { refreshToken: 'abc', expiration: Math.floor(now / 1000) - 10 };
    const spy = jest.fn();
    service.refresh$.subscribe(spy);
    service.setRefreshState(token);
    expect(spy).toHaveBeenCalledWith(token);
  });

  it('isExpired should return true if expiration is missing or in the past', () => {
    // @ts-expect-private
    expect((service as any).isExpired({ refreshToken: 'abc', expiration: undefined as any })).toBe(true);
    expect((service as any).isExpired({ refreshToken: 'abc', expiration: Math.floor(now / 1000) - 10 })).toBe(true);
  });

  it('isExpired should return false if expiration is in the future', () => {
    // @ts-expect-private
    expect((service as any).isExpired({ refreshToken: 'abc', expiration: Math.floor(now / 1000) + 1000 })).toBe(false);
  });
});