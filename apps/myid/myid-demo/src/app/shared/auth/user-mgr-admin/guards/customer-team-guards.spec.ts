import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { lastValueFrom } from 'rxjs';
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
        { provide: MockUserMgrAdminAuthService, useValue: mockAuthService },
        { provide: MY_ID_AUTH_SERVICE_TOKEN, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });
  });

  //-------------------//

  describe('customerAdminGuard', () => {
    it('allows activation if isSprAdmin is true', async () => {
      mockAuthService.isCusAdmin.set(true);
      const guard = customerAdminGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprAdmin is false', async () => {
      mockAuthService.isCusAdmin.set(false);
      const guard = customerAdminGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('customerMgrGuard', () => {
    it('allows activation if isSprMgr is true', async () => {
      mockAuthService.isCusMgr.set(true);
      const guard = customerMgrGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprMgr is false', async () => {
      mockAuthService.isCusMgr.set(false);
      const guard = customerMgrGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('customerUserGuard', () => {
    it('allows activation if isSprUser is true', async () => {
      mockAuthService.isCusUser.set(true);
      const guard = customerUserGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprUser is false', async () => {
      mockAuthService.isCusUser.set(false);
      const guard = customerUserGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('customerGuestGuard', () => {
    it('allows activation if isSprGuest is true', async () => {
      mockAuthService.isCusGuest.set(true);
      const guard = customerGuestGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprGuest is false', async () => {
      mockAuthService.isCusGuest.set(false);
      const guard = customerGuestGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('customerAdminMinimumGuard', () => {
    it('allows activation if isSprAdminMinimum is true', async () => {
      mockAuthService.isCusAdminMinimum.set(true);
      const guard = customerAdminMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprAdminMinimum is false', async () => {
      mockAuthService.isCusAdminMinimum.set(false);
      const guard = customerAdminMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('customerMgrMinimumMinimumGuard', () => {
    it('allows activation if isSprMgrMinimumMinimum is true', async () => {
      mockAuthService.isCusMgrMinimum.set(true);
      const guard = customerMgrMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprMgrMinimumMinimum is false', async () => {
      mockAuthService.isCusMgrMinimum.set(false);
      const guard = customerMgrMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('customerUserMinimumGuard', () => {
    it('allows activation if isSprUserMinimum is true', async () => {
      mockAuthService.isCusUserMinimum.set(true);
      const guard = customerUserMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprUserMinimum is false', async () => {
      mockAuthService.isCusUserMinimum.set(false);
      const guard = customerUserMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('customerGuestMinimumGuard', () => {
    it('allows activation if isSprGuestMinimum is true', async () => {
      mockAuthService.isCusGuestMinimum.set(true);
      const guard = customerGuestMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprGuestMinimum is false', async () => {
      mockAuthService.isCusGuestMinimum.set(false);
      const guard = customerGuestMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//



});
