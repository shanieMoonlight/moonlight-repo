import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { customerAdminGuard, customerAdminMinimumGuard, customerGuestGuard, customerGuestMinimumGuard, customerMgrGuard, customerMgrMinimumGuard, customerUserGuard, customerUserMinimumGuard } from './customer-team-guards';
import { MockUserMgrAdminAuthService } from './testing/mock-myid-auth.service';
import { MY_ID_AUTH_SERVICE_TOKEN } from './user-mgr-admin-auth-guard.config';

const mockActRoute = {
  queryParamMap: of({ get: () => null })
};

describe('DevMode/Combined Guards', () => {
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

  //-------------------//

  describe('customerAdminGuard', () => {
    it('allows activation if isSprAdmin is true', () => {
      mockAuthService.isCusAdmin.set(true);
      const guard = customerAdminGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSprAdmin is false', () => {
      mockAuthService.isCusAdmin.set(false);
      const guard = customerAdminGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('customerMgrGuard', () => {
    it('allows activation if isSprMgr is true', () => {
      mockAuthService.isCusMgr.set(true);
      const guard = customerMgrGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSprMgr is false', () => {
      mockAuthService.isCusMgr.set(false);
      const guard = customerMgrGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('customerUserGuard', () => {
    it('allows activation if isSprUser is true', () => {
      mockAuthService.isCusUser.set(true);
      const guard = customerUserGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSprUser is false', () => {
      mockAuthService.isCusUser.set(false);
      const guard = customerUserGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('customerGuestGuard', () => {
    it('allows activation if isSprGuest is true', () => {
      mockAuthService.isCusGuest.set(true);
      const guard = customerGuestGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSprGuest is false', () => {
      mockAuthService.isCusGuest.set(false);
      const guard = customerGuestGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('customerAdminMinimumGuard', () => {
    it('allows activation if isSprAdminMinimum is true', () => {
      mockAuthService.isCusAdminMinimum.set(true);
      const guard = customerAdminMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSprAdminMinimum is false', () => {
      mockAuthService.isCusAdminMinimum.set(false);
      const guard = customerAdminMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('customerMgrMinimumMinimumGuard', () => {
    it('allows activation if isSprMgrMinimumMinimum is true', () => {
      mockAuthService.isCusMgrMinimum.set(true);
      const guard = customerMgrMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSprMgrMinimumMinimum is false', () => {
      mockAuthService.isCusMgrMinimum.set(false);
      const guard = customerMgrMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('customerUserMinimumGuard', () => {
    it('allows activation if isSprUserMinimum is true', () => {
      mockAuthService.isCusUserMinimum.set(true);
      const guard = customerUserMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSprUserMinimum is false', () => {
      mockAuthService.isCusUserMinimum.set(false);
      const guard = customerUserMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('customerGuestMinimumGuard', () => {
    it('allows activation if isSprGuestMinimum is true', () => {
      mockAuthService.isCusGuestMinimum.set(true);
      const guard = customerGuestMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSprGuestMinimum is false', () => {
      mockAuthService.isCusGuestMinimum.set(false);
      const guard = customerGuestMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//



});
