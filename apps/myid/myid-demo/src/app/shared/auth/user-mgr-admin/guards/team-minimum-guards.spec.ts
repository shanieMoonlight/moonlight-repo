import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { MY_ID_AUTH_SERVICE_TOKEN } from './user-mgr-admin-auth-guard.config';
import { cusLdrMinimumGuard, mntcUserMinimumGuard, sprAdminMinimumGuard, sprMgrMinimumGuard } from './team-minimum-guards';
import { MockUserMgrAdminAuthService } from './testing/mock-myid-auth.service';

const mockActRoute = {
  queryParamMap: of({ get: () => null })
};

describe('Team Minimum Guards', () => {
  let mockAuthService: MockUserMgrAdminAuthService;
  let mockRouter: jest.Mocked<Router>;
  let mockUrlTree: UrlTree;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    mockUrlTree = {} as UrlTree;
    mockAuthService = new MockUserMgrAdminAuthService();
    mockRouter = {
      createUrlTree: jest.fn().mockReturnValue(mockUrlTree),
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = {} as RouterStateSnapshot;
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: mockActRoute },
        { provide: MockUserMgrAdminAuthService, useValue: mockAuthService },
        { provide: MY_ID_AUTH_SERVICE_TOKEN, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  describe('myIdIsSuperAdminMinimumGuard', () => {
    it('allows activation if isSuperAdminMinimum is true', () => {
      mockAuthService.isSuperAdminMinimum.set(true);
      const guard = sprAdminMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSuperAdminMinimum is false', () => {
      mockAuthService.isSuperAdminMinimum.set(false);
      const guard = sprAdminMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  describe('myIdIsSuperMgrMinimumGuard', () => {
    it('allows activation if isSuperMgrMinimum is true', () => {
      mockAuthService.isSuperMgrMinimum.set(true);
      const guard = sprMgrMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSuperMgrMinimum is false', () => {
      mockAuthService.isSuperMgrMinimum.set(false);
      const guard = sprMgrMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  describe('myIdIsMntcUserMinimumGuard', () => {
    it('allows activation if isMntcUserMinimum is true', () => {
      mockAuthService.isMntcUserMinimum.set(true);
      const guard = mntcUserMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isMntcUserMinimum is false', () => {
      mockAuthService.isMntcUserMinimum.set(false);
      const guard = mntcUserMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  describe('myIdIsCusLdrMinimumGuard', () => {
    it('allows activation if isCusLdrMinimum is true', () => {
      mockAuthService.isCusLdrMinimum.set(true);
      const guard = cusLdrMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isCusLdrMinimum is false', () => {
      mockAuthService.isCusLdrMinimum.set(false);
      const guard = cusLdrMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });
});
