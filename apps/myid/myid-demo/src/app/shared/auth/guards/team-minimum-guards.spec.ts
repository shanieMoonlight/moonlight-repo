import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { myIdIsSprAdminMinimumGuard, myIdIsSprMgrMinimumGuard, myIdIsMntcUserMinimumGuard, myIdIsCusLdrMinimumGuard } from './team-minimum-guards';
import { of } from 'rxjs';
import { MY_ID_AUTH_SERVICE_TOKEN } from './myid-auth-guard.config';
import { MockMyIdAuthService } from './testing/mock-myid-auth.service';

const mockActRoute = {
  queryParamMap: of({ get: () => null })
};

describe('Team Minimum Guards', () => {
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

  describe('myIdIsSprAdminMinimumGuard', () => {
    it('allows activation if isSprAdminMinimum is true', () => {
      mockAuthService.isSprAdminMinimum.set(true);
      const guard = myIdIsSprAdminMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSprAdminMinimum is false', () => {
      mockAuthService.isSprAdminMinimum.set(false);
      const guard = myIdIsSprAdminMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  describe('myIdIsSprMgrMinimumGuard', () => {
    it('allows activation if isSprMgrMinimum is true', () => {
      mockAuthService.isSprMgrMinimum.set(true);
      const guard = myIdIsSprMgrMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSprMgrMinimum is false', () => {
      mockAuthService.isSprMgrMinimum.set(false);
      const guard = myIdIsSprMgrMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  describe('myIdIsMntcUserMinimumGuard', () => {
    it('allows activation if isMntcUserMinimum is true', () => {
      mockAuthService.isMntcUserMinimum.set(true);
      const guard = myIdIsMntcUserMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isMntcUserMinimum is false', () => {
      mockAuthService.isMntcUserMinimum.set(false);
      const guard = myIdIsMntcUserMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  describe('myIdIsCusLdrMinimumGuard', () => {
    it('allows activation if isCusLdrMinimum is true', () => {
      mockAuthService.isCusLdrMinimum.set(true);
      const guard = myIdIsCusLdrMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isCusLdrMinimum is false', () => {
      mockAuthService.isCusLdrMinimum.set(false);
      const guard = myIdIsCusLdrMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });
});
