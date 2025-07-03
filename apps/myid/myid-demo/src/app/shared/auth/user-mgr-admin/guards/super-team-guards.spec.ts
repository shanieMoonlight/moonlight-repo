import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { lastValueFrom } from 'rxjs';
import { superAdminGuard, superAdminMinimumGuard, superGuestGuard, superGuestMinimumGuard, superMgrGuard, superMgrMinimumGuard, superUserGuard, superUserMinimumGuard } from './super-team-guards';
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

  describe('superAdminGuard', () => {
    it('allows activation if isSprAdmin is true', async () => {
      mockAuthService.isSuperAdmin.set(true);
      const guard = superAdminGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprAdmin is false', async () => {
      mockAuthService.isSuperAdmin.set(false);
      const guard = superAdminGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('superMgrGuard', () => {
    it('allows activation if isSprMgr is true', async () => {
      mockAuthService.isSuperMgr.set(true);
      const guard = superMgrGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprMgr is false', async () => {
      mockAuthService.isSuperMgr.set(false);
      const guard = superMgrGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('superUserGuard', () => {
    it('allows activation if isSprUser is true', async () => {
      mockAuthService.isSuperUser.set(true);
      const guard = superUserGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprUser is false', async () => {
      mockAuthService.isSuperUser.set(false);
      const guard = superUserGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('superGuestGuard', () => {
    it('allows activation if isSprGuest is true', async () => {
      mockAuthService.isSuperGuest.set(true);
      const guard = superGuestGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprGuest is false', async () => {
      mockAuthService.isSuperGuest.set(false);
      const guard = superGuestGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//
   
    describe('superAdminMinimumGuard', () => {
    it('allows activation if isSprAdminMinimum is true', async () => {
      mockAuthService.isSuperAdminMinimum.set(true);
      const guard = superAdminMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprAdminMinimum is false', async () => {
      mockAuthService.isSuperAdminMinimum.set(false);
      const guard = superAdminMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('superMgrMinimumMinimumGuard', () => {
    it('allows activation if isSprMgrMinimumMinimum is true', async () => {
      mockAuthService.isSuperMgrMinimum.set(true);
      const guard = superMgrMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprMgrMinimumMinimum is false', async () => {
      mockAuthService.isSuperMgrMinimum.set(false);
      const guard = superMgrMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('superUserMinimumGuard', () => {
    it('allows activation if isSprUserMinimum is true', async () => {
      mockAuthService.isSuperUserMinimum.set(true);
      const guard = superUserMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprUserMinimum is false', async () => {
      mockAuthService.isSuperUserMinimum.set(false);
      const guard = superUserMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('superGuestMinimumGuard', () => {
    it('allows activation if isSprGuestMinimum is true', async () => {
      mockAuthService.isSuperGuestMinimum.set(true);
      const guard = superGuestMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprGuestMinimum is false', async () => {
      mockAuthService.isSuperGuestMinimum.set(false);
      const guard = superGuestMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//



});
