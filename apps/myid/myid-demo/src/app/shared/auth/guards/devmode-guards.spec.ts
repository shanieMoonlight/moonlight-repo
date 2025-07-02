import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { myIdIsMntcOrDevGuard, myIdIsSuperOrDevGuard } from './devmode-guards';
import { of } from 'rxjs';
import { MY_ID_AUTH_SERVICE_TOKEN } from './myid-auth-guard.config';
import { MockMyIdAuthService } from './testing/mock-myid-auth.service';

const mockActRoute = {
  queryParamMap: of({ get: () => null })
};

describe('DevMode/Combined Guards', () => {
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

  describe('myIdIsMntcOrDevGuard', () => {
    it('allows activation if isMntcOrDev is true', () => {
      mockAuthService.isMntcOrDev.set(true);
      const guard = myIdIsMntcOrDevGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isMntcOrDev is false', () => {
      mockAuthService.isMntcOrDev.set(false);
      const guard = myIdIsMntcOrDevGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  describe('myIdIsSuperOrDevGuard', () => {
    it('allows activation if isSuperOrDev is true', () => {
      mockAuthService.isSuperOrDev.set(true);
      const guard = myIdIsSuperOrDevGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSuperOrDev is false', () => {
      mockAuthService.isSuperOrDev.set(false);
      const guard = myIdIsSuperOrDevGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });
});
