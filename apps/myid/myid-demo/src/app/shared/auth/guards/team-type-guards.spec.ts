import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { myIdIsSprGuard, myIdIsMntcGuard, myIdIsCustomerGuard } from './team-type-guards';
import { of } from 'rxjs';
import { MY_ID_AUTH_SERVICE_TOKEN } from './myid-auth-guard.config';
import { MockMyIdAuthService } from './testing/mock-myid-auth.service';

const mockActRoute = {
  queryParamMap: of({ get: () => null })
};

describe('Team Type Guards', () => {
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

  describe('myIdIsSprGuard', () => {
    it('allows activation if isSpr is true', () => {
      mockAuthService.isSuper.set(true);
      const guard = myIdIsSprGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSpr is false', () => {
      mockAuthService.isSuper.set(false);
      const guard = myIdIsSprGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  describe('myIdIsMntcGuard', () => {
    it('allows activation if isMntc is true', () => {
      mockAuthService.isMntc.set(true);
      const guard = myIdIsMntcGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isMntc is false', () => {
      mockAuthService.isMntc.set(false);
      const guard = myIdIsMntcGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  describe('myIdIsCustomerGuard', () => {
    it('allows activation if isCustomer is true', () => {
      mockAuthService.isCustomer.set(true);
      const guard = myIdIsCustomerGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isCustomer is false', () => {
      mockAuthService.isCustomer.set(false);
      const guard = myIdIsCustomerGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });
});
