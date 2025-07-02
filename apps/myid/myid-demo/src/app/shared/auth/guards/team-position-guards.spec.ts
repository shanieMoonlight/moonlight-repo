import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { myIdHasPositionGuard, myIdHasPositionRangeGuard, myIdHasPositionMinimumGuard } from './team-position-guards';
import { of } from 'rxjs';
import { MY_ID_AUTH_SERVICE_TOKEN } from './myid-auth-guard.config';
import { MockMyIdAuthService } from './testing/mock-myid-auth.service';



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

  describe('myIdHasPositionGuard', () => {
    it('allows activation if user has position', () => {
      mockAuthService.hasPosition.mockReturnValue(true);
      mockAuthService.position.set(2);
      const guard = myIdHasPositionGuard(2);
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });

    it('redirects if user does not have position', () => {
      mockAuthService.position.set(0);
      let guard = myIdHasPositionGuard(2);
      let result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      mockAuthService.position.set(5);
       guard = myIdHasPositionGuard(2);
       result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
    });
  });

  describe('myIdHasPositionRangeGuard', () => {
    it('allows activation if user has position in range', () => {
      mockAuthService.position.set(2);
      const guard = myIdHasPositionRangeGuard(1, 3);
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });

    it('redirects if user does not have position in range', () => {
      mockAuthService.position.set(5);
      const guard = myIdHasPositionRangeGuard(1, 3);
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  describe('myIdHasPositionMinimumGuard', () => {
    it('allows activation if user has position >= minimum', () => {
      mockAuthService.position.set(5);
      const guard = myIdHasPositionMinimumGuard(3);
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });

    it('redirects if user has position < minimum', () => {
      mockAuthService.position.set(2);
      const guard = myIdHasPositionMinimumGuard(3);
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });
});
