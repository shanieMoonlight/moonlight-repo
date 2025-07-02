import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MY_ID_AUTH_SERVICE_TOKEN } from './user-mgr-admin-auth-guard.config';
import { MockMyIdAuthService } from './testing/mock-myid-auth.service';
import { isAdminGuard, isGuestGuard, isMgrGuard, isUserGuard } from './team-position-guards';



const mockActRoute = {
  queryParamMap: of({ get: () => null })
}

describe('Position/Range Guards', () => {
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
    mockRoute = {} as ActivatedRouteSnapshot;
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

  describe('is Admin guard', () => {
    it('allows activation if user isAdmin', () => {
      mockAuthService.isAdmin.set(true);
      const guard = isAdminGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });

    it('redirects if user is not Admin', () => {
      mockAuthService.isAdmin.set(false);
      const guard = isAdminGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
    });
  });

  
  describe('is Mgr guard', () => {
    it('allows activation if user isMgr', () => {
      mockAuthService.isMgr.set(true);
      const guard = isMgrGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });

    it('redirects if user is not Mgr', () => {
      mockAuthService.isMgr.set(false);
      const guard = isMgrGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
    });
  });

  
  describe('is User guard', () => {
    it('allows activation if user isUser', () => {
      mockAuthService.isUser.set(true);
      const guard = isUserGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });

    it('redirects if user is not User', () => {
      mockAuthService.isUser.set(false);
      const guard = isUserGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
    });
  });

  describe('is Guest guard', () => {
    it('allows activation if user isGuest', () => {
      mockAuthService.isGuest.set(true);
      const guard = isGuestGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });

    it('redirects if user is not Guest', () => {
      mockAuthService.isGuest.set(false);
      const guard = isGuestGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
    });
  });

  
});
