import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { MY_ID_AUTH_SERVICE_TOKEN } from './config/myid-auth-guard.config';
import {
  superGuard,
  superLdrGuard,
  superMinimumGuard,
  superMinimumOrDevGuard,
  superOrDevGuard,
  superPositionGuard,
  superPositionMinimumGuard,
  superPositionRangeGuard
} from './super-team-guards';
import { MockMyIdAuthService } from './testing/mock-myid-auth.service';

const mockActRoute = {
  queryParamMap: of({ get: () => null })
};

describe('DevMode/Combined Guards', () => {
  let mockAuthService: MockMyIdAuthService;
  let mockRouter: jest.Mocked<Router>;
  let mockUrlTree: UrlTree;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    mockUrlTree = {} as UrlTree;
    mockAuthService = new MockMyIdAuthService();
    mockRouter = {
      createUrlTree: jest.fn().mockReturnValue(mockUrlTree),
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;
    mockRoute = {
      queryParamMap: {
        get: () => null,
        has: () => false 
      }
    } as unknown as ActivatedRouteSnapshot;
    mockState = {} as RouterStateSnapshot;
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: mockActRoute },
        { provide: MockMyIdAuthService, useValue: mockAuthService },
        { provide: MY_ID_AUTH_SERVICE_TOKEN, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  describe('superGuard', () => {
    it('allows activation if isSpr is true', async () => {
      mockAuthService.isSuper.set(true);
      const guard = superGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSpr is false', async () => {
      mockAuthService.isSuper.set(false);
      const guard = superGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('superLdr', () => {
    it('allows activation if isSuperLdr is true', async () => {
      mockAuthService.isSuperLdr.set(true);
      const guard = superLdrGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSuperLdr is false', async () => {
      mockAuthService.isSuperLdr.set(false);
      const guard = superLdrGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
    });
  });

  //-------------------//

  describe('superMinimumGuard', () => {
    it('allows activation if isSuperMinimum is true', async () => {
      mockAuthService.isSuperMinimum.set(true);
      const guard = superMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSuper is false', async () => {
      mockAuthService.isSuperMinimum.set(false);
      const guard = superMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
    });
  });

  //-------------------//

  describe('superOrDevGuard', () => {
    it('allows activation if isSuperOrDev is true', async () => {
      mockAuthService.isSuperOrDev.set(true);
      const guard = superOrDevGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSuperOrDev is false', async () => {
      mockAuthService.isSuperOrDev.set(false);
      const guard = superOrDevGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
    });
  });

  //-------------------//

  describe('superMinimumOrDevGuard', () => {
    it('allows activation if isSuperMinimumOrDev is true', async () => {
      mockAuthService.isSuperMinimumOrDev.set(true);
      const guard = superMinimumOrDevGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSuperOrDev is false', async () => {
      mockAuthService.isSuperMinimumOrDev.set(false);
      const guard = superMinimumOrDevGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
    });
  });

  //-------------------//

  describe('superPositionGuard', () => {
    it('allows activation if user has super position', async () => {
      mockAuthService.isSuperPosition.mockReturnValue(signal(true));
      const guard = superPositionGuard(2);
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if user does not have super position', async () => {
      mockAuthService.isSuperPosition.mockReturnValue(signal(false));
      const guard = superPositionGuard(2);
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
    });
  });

  //-------------------//

  describe('superPositionMinimumGuard', () => {
    it('allows activation if user has super positionMinimum', async () => {
      mockAuthService.isSuperPositionMinimum.mockReturnValue(signal(true));
      const guard = superPositionMinimumGuard(3);
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if user does not have super positionMinimum', async () => {
      mockAuthService.isSuperPositionMinimum.mockReturnValue(signal(false));
      const guard = superPositionMinimumGuard(3);
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
    });
  });

  //-------------------//

  describe('superPositionRangeGuard', () => {
    it('allows activation if user has super positionRange', async () => {
      mockAuthService.position.set(2);
      mockAuthService.isSuper.set(true);
      const guard = superPositionRangeGuard(1, 3);
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if user does not have super positionRange', async () => {
      const guard = superPositionRangeGuard(1, 3);
      mockAuthService.position.set(0);
      mockAuthService.isSuper.set(true);
      let result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      mockAuthService.position.set(0);
      mockAuthService.isSuper.set(false);
      result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      mockAuthService.position.set(5);
      mockAuthService.isSuper.set(true);
      result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      mockAuthService.position.set(5);
      mockAuthService.isSuper.set(false);
      result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      mockAuthService.position.set(2);
      mockAuthService.isSuper.set(false);
      result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
    });
  });

  //-------------------//


});
