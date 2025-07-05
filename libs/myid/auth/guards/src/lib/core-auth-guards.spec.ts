/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MyIdRouter } from '@spider-baby/myid-auth/utils';
import { lastValueFrom, Observable, of } from 'rxjs';
import { MY_ID_AUTH_SERVICE_TOKEN } from './config/myid-auth-guard.config';
import {
  createMyIdAllRolesGuard,
  createMyIdAnyRoleGuard,
  createMyIdClaimGuard,
  createMyIdCustomGuard,
  createMyIdRoleGuard,
  emailVerifiedGuard,
  loggedInGuard
} from './core-auth-guards';
import { MockMyIdAuthService } from './testing/mock-myid-auth.service';

const mockActRoute = {
  queryParamMap: of({
    get: () => null
  })
};



describe('Core Auth Guards', () => {
  let mockAuthService: MockMyIdAuthService;
  let mockRouter: jest.Mocked<Router>;
  let mockUrlTree: UrlTree;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;
  let mockMyIdRouter: { createLoginUrlTree: jest.Mock };

  beforeEach(() => {
    mockUrlTree = {} as UrlTree;
    mockAuthService = new MockMyIdAuthService();
    mockRouter = {
      createUrlTree: jest.fn().mockReturnValue(mockUrlTree),
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;
    mockMyIdRouter = { createLoginUrlTree: jest.fn().mockReturnValue(mockUrlTree) };
    mockRoute = {
      queryParamMap: {
        get: () => null,
        has: () => false // or true, depending on your test
      }
    } as unknown as ActivatedRouteSnapshot;
    mockState = {} as RouterStateSnapshot;
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: mockActRoute },
        { provide: MockMyIdAuthService, useValue: mockAuthService },
        { provide: MY_ID_AUTH_SERVICE_TOKEN, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: MyIdRouter, useValue: mockMyIdRouter },
      ],
    });
  });

  describe('myIdLoggedInGuard', () => {
    it('allows activation if logged in', async () => {
      mockAuthService.isLoggedIn.set(true);
      const guard = loggedInGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if not logged in', async () => {
      mockAuthService.isLoggedIn.set(false);
      const guard = loggedInGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockMyIdRouter.createLoginUrlTree).toHaveBeenCalled();
    });
  });

  describe('myIdEmailVerifiedGuard', () => {
    it('allows activation if logged in and email verified', async () => {
      mockAuthService.isLoggedIn.set(true);
      mockAuthService.emailVerified.set(true);
      const guard = emailVerifiedGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if not logged in or email not verified', async () => {
      mockAuthService.isLoggedIn.set(false);
      mockAuthService.emailVerified.set(false);
      const guard = emailVerifiedGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockMyIdRouter.createLoginUrlTree).toHaveBeenCalled();
    });
  });

  describe('createMyIdRoleGuard', () => {
    it('allows activation if logged in and has role', async () => {
      mockAuthService.isLoggedIn.set(true);
      mockAuthService.hasRole.mockReturnValue(true);
      const guard = createMyIdRoleGuard('admin');
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
      expect(mockAuthService.hasRole).toHaveBeenCalledWith('admin');
    });
    it('redirects if not logged in or lacks role', async () => {
      mockAuthService.isLoggedIn.set(false);
      mockAuthService.hasRole.mockReturnValue(false);
      const guard = createMyIdRoleGuard('admin');
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockMyIdRouter.createLoginUrlTree).toHaveBeenCalled();
    });
  });

  describe('createMyIdClaimGuard', () => {
    it('allows activation if logged in and has claim', async () => {
      mockAuthService.isLoggedIn.set(true);
      mockAuthService.hasClaim.mockReturnValue(true);
      const guard = createMyIdClaimGuard('foo' as any, 'bar');
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
      expect(mockAuthService.hasClaim).toHaveBeenCalledWith('foo', 'bar');
    });
    it('redirects if not logged in or lacks claim', async () => {
      mockAuthService.isLoggedIn.set(false);
      mockAuthService.hasClaim.mockReturnValue(false);
      const guard = createMyIdClaimGuard('foo' as any, 'bar');
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockMyIdRouter.createLoginUrlTree).toHaveBeenCalled();
    });
  });

  describe('createMyIdAnyRoleGuard', () => {
    it('allows activation if user has any required role', async () => {
      mockAuthService.roles.set(['admin', 'user']);
      const guard = createMyIdAnyRoleGuard(['admin', 'moderator']);
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if user has none of the required roles', async () => {
      mockAuthService.roles.set(['guest']);
      const guard = createMyIdAnyRoleGuard(['admin', 'moderator']);
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockMyIdRouter.createLoginUrlTree).toHaveBeenCalled();
    });
  });

  describe('createMyIdAllRolesGuard', () => {
    it('allows activation if user has all required roles', async () => {
      mockAuthService.isLoggedIn.set(true);
      mockAuthService.roles.set(['admin', 'user', 'moderator']);
      const guard = createMyIdAllRolesGuard(['admin', 'user']);
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if user is missing some required roles', async () => {
      mockAuthService.isLoggedIn.set(true);
      mockAuthService.roles.set(['user']);
      const guard = createMyIdAllRolesGuard(['admin', 'user']);
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockMyIdRouter.createLoginUrlTree).toHaveBeenCalled();
    });
  });

  describe('createMyIdCustomGuard', () => {
    it('allows activation if custom check passes', async () => {
      const guard = createMyIdCustomGuard(() => true);
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if custom check fails', async () => {
      const guard = createMyIdCustomGuard(() => false);
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockMyIdRouter.createLoginUrlTree).toHaveBeenCalled();
    });
  });
});
