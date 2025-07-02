import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { mntcAdminGuard, mntcAdminMinimumGuard, mntcGuestGuard, mntcGuestMinimumGuard, mntcMgrGuard, mntcMgrMinimumGuard, mntcUserGuard, mntcUserMinimumGuard } from './mntc-team-guards';
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

  describe('mntcAdminGuard', () => {
    it('allows activation if isSprAdmin is true', () => {
      mockAuthService.isMntcAdmin.set(true);
      const guard = mntcAdminGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSprAdmin is false', () => {
      mockAuthService.isMntcAdmin.set(false);
      const guard = mntcAdminGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('mntcMgrGuard', () => {
    it('allows activation if isSprMgr is true', () => {
      mockAuthService.isMntcMgr.set(true);
      const guard = mntcMgrGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSprMgr is false', () => {
      mockAuthService.isMntcMgr.set(false);
      const guard = mntcMgrGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('mntcUserGuard', () => {
    it('allows activation if isSprUser is true', () => {
      mockAuthService.isMntcUser.set(true);
      const guard = mntcUserGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSprUser is false', () => {
      mockAuthService.isMntcUser.set(false);
      const guard = mntcUserGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('mntcGuestGuard', () => {
    it('allows activation if isSprGuest is true', () => {
      mockAuthService.isMntcGuest.set(true);
      const guard = mntcGuestGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSprGuest is false', () => {
      mockAuthService.isMntcGuest.set(false);
      const guard = mntcGuestGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('mntcAdminMinimumGuard', () => {
    it('allows activation if isSprAdminMinimum is true', () => {
      mockAuthService.isMntcAdminMinimum.set(true);
      const guard = mntcAdminMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSpr is false', () => {
      mockAuthService.isMntcAdminMinimum.set(false);
      const guard = mntcAdminMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('mntcMgrMinimumMinimumGuard', () => {
    it('allows activation if isSprMgrMinimumMinimum is true', () => {
      mockAuthService.isMntcMgrMinimum.set(true);
      const guard = mntcMgrMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSprMgrMinimumMinimum is false', () => {
      mockAuthService.isMntcMgrMinimum.set(false);
      const guard = mntcMgrMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('mntcUserMinimumGuard', () => {
    it('allows activation if isSprUserMinimum is true', () => {
      mockAuthService.isMntcUserMinimum.set(true);
      const guard = mntcUserMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSprUserMinimum is false', () => {
      mockAuthService.isMntcUserMinimum.set(false);
      const guard = mntcUserMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('mntcGuestMinimumGuard', () => {
    it('allows activation if isSprGuestMinimum is true', () => {
      mockAuthService.isMntcGuestMinimum.set(true);
      const guard = mntcGuestMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSprGuestMinimum is false', () => {
      mockAuthService.isMntcGuestMinimum.set(false);
      const guard = mntcGuestMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//



});
