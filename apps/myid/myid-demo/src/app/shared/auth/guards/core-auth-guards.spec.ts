import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import {
  createMyIdRoleGuard,
  createMyIdClaimGuard,
  createMyIdAnyRoleGuard,
  createMyIdAllRolesGuard,
  emailVerifiedGuard,
  loggedInGuard,
  createMyIdCustomGuard
} from './core-auth-guards';
import { of } from 'rxjs';
import { MY_ID_AUTH_SERVICE_TOKEN } from './myid-auth-guard.config';
import { MockMyIdAuthService } from './testing/mock-myid-auth.service';
import { MyIdRouter } from '../../id/utils/services/id-navigation/id-router.service';

const mockActRoute = {
  queryParamMap: of({ get: () => null })
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
    mockRoute = {} as ActivatedRouteSnapshot;
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
    it('allows activation if logged in', () => {
      mockAuthService.isLoggedIn.set(true);
      const guard = loggedInGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if not logged in', () => {
      mockAuthService.isLoggedIn.set(false);
      const guard = loggedInGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockMyIdRouter.createLoginUrlTree).toHaveBeenCalled();
    });
  });

  describe('myIdEmailVerifiedGuard', () => {
    it('allows activation if logged in and email verified', () => {
      mockAuthService.isLoggedIn.set(true);
      mockAuthService.emailVerified.set(true);
      const guard = emailVerifiedGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if not logged in or email not verified', () => {
      mockAuthService.isLoggedIn.set(false);
      mockAuthService.emailVerified.set(false);
      const guard = emailVerifiedGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockMyIdRouter.createLoginUrlTree).toHaveBeenCalled();
    });
  });

  describe('createMyIdRoleGuard', () => {
    it('allows activation if logged in and has role', () => {
      mockAuthService.isLoggedIn.set(true);
      mockAuthService.hasRole.mockReturnValue(true);
      const guard = createMyIdRoleGuard('admin');
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
      expect(mockAuthService.hasRole).toHaveBeenCalledWith('admin');
    });
    it('redirects if not logged in or lacks role', () => {
      mockAuthService.isLoggedIn.set(false);
      mockAuthService.hasRole.mockReturnValue(false);
      const guard = createMyIdRoleGuard('admin');
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockMyIdRouter.createLoginUrlTree).toHaveBeenCalled();
    });
  });

  describe('createMyIdClaimGuard', () => {
    it('allows activation if logged in and has claim', () => {
      mockAuthService.isLoggedIn.set(true);
      mockAuthService.hasClaim.mockReturnValue(true);
      const guard = createMyIdClaimGuard('foo' as any, 'bar');
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
      expect(mockAuthService.hasClaim).toHaveBeenCalledWith('foo', 'bar');
    });
    it('redirects if not logged in or lacks claim', () => {
      mockAuthService.isLoggedIn.set(false);
      mockAuthService.hasClaim.mockReturnValue(false);
      const guard = createMyIdClaimGuard('foo' as any, 'bar');
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockMyIdRouter.createLoginUrlTree).toHaveBeenCalled();
    });
  });

  describe('createMyIdAnyRoleGuard', () => {
    it('allows activation if user has any required role', () => {
      mockAuthService.roles.set(['admin', 'user']);
      const guard = createMyIdAnyRoleGuard(['admin', 'moderator']);
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if user has none of the required roles', () => {
      mockAuthService.roles.set(['guest']);
      const guard = createMyIdAnyRoleGuard(['admin', 'moderator']);
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockMyIdRouter.createLoginUrlTree).toHaveBeenCalled();
    });
  });

  describe('createMyIdAllRolesGuard', () => {
    it('allows activation if user has all required roles', () => {
      mockAuthService.isLoggedIn.set(true);
      mockAuthService.roles.set(['admin', 'user', 'moderator']);
      const guard = createMyIdAllRolesGuard(['admin', 'user']);
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });


    it('redirects if user is missing some required roles', () => {
      mockAuthService.isLoggedIn.set(true);
      mockAuthService.roles.set(['user']);
      const guard = createMyIdAllRolesGuard(['admin', 'user']);
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockMyIdRouter.createLoginUrlTree).toHaveBeenCalled();
    });
  });
  

  describe('createMyIdCustomGuard', () => {
    it('allows activation if custom check passes', () => {
      const guard = createMyIdCustomGuard(() => true);
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if custom check fails', () => {
      const guard = createMyIdCustomGuard(() => false);
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockMyIdRouter.createLoginUrlTree).toHaveBeenCalled();
    });
  });
});
