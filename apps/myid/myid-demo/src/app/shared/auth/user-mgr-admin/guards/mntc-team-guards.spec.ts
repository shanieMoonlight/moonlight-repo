import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { lastValueFrom } from 'rxjs';
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

  describe('mntcAdminGuard', () => {
    it('allows activation if isSprAdmin is true', async () => {
      mockAuthService.isMntcAdmin.set(true);
      const guard = mntcAdminGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprAdmin is false', async () => {
      mockAuthService.isMntcAdmin.set(false);
      const guard = mntcAdminGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('mntcMgrGuard', () => {
    it('allows activation if isSprMgr is true', async () => {
      mockAuthService.isMntcMgr.set(true);
      const guard = mntcMgrGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprMgr is false', async () => {
      mockAuthService.isMntcMgr.set(false);
      const guard = mntcMgrGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('mntcUserGuard', () => {
    it('allows activation if isSprUser is true', async () => {
      mockAuthService.isMntcUser.set(true);
      const guard = mntcUserGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprUser is false', async () => {
      mockAuthService.isMntcUser.set(false);
      const guard = mntcUserGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('mntcGuestGuard', () => {
    it('allows activation if isSprGuest is true', async () => {
      mockAuthService.isMntcGuest.set(true);
      const guard = mntcGuestGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprGuest is false', async () => {
      mockAuthService.isMntcGuest.set(false);
      const guard = mntcGuestGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('mntcAdminMinimumGuard', () => {
    it('allows activation if isSprAdminMinimum is true', async () => {
      mockAuthService.isMntcAdminMinimum.set(true);
      const guard = mntcAdminMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSpr is false', async () => {
      mockAuthService.isMntcAdminMinimum.set(false);
      const guard = mntcAdminMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('mntcMgrMinimumMinimumGuard', () => {
    it('allows activation if isSprMgrMinimumMinimum is true', async () => {
      mockAuthService.isMntcMgrMinimum.set(true);
      const guard = mntcMgrMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprMgrMinimumMinimum is false', async () => {
      mockAuthService.isMntcMgrMinimum.set(false);
      const guard = mntcMgrMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('mntcUserMinimumGuard', () => {
    it('allows activation if isSprUserMinimum is true', async () => {
      mockAuthService.isMntcUserMinimum.set(true);
      const guard = mntcUserMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprUserMinimum is false', async () => {
      mockAuthService.isMntcUserMinimum.set(false);
      const guard = mntcUserMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//

  describe('mntcGuestMinimumGuard', () => {
    it('allows activation if isSprGuestMinimum is true', async () => {
      mockAuthService.isMntcGuestMinimum.set(true);
      const guard = mntcGuestMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(true);
    });
    it('redirects if isSprGuestMinimum is false', async () => {
      mockAuthService.isMntcGuestMinimum.set(false);
      const guard = mntcGuestMinimumGuard;
      const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
      await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  //-------------------//



});
