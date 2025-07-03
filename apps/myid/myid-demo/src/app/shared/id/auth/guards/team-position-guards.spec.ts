import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { positionGuard, positionRangeGuard, positionMinimumGuard, leaderGuard } from './team-position-guards';
import { of } from 'rxjs';
import { MY_ID_AUTH_SERVICE_TOKEN } from './config/myid-auth-guard.config';
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
      const guard = positionGuard(2);
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });

    it('redirects if user does not have position', () => {
      mockAuthService.position.set(0);
      let guard = positionGuard(2);
      let result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      mockAuthService.position.set(5);
       guard = positionGuard(2);
       result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
    });
  });

  describe('myIdHasPositionRangeGuard', () => {
    it('allows activation if user has position in range', () => {
      mockAuthService.position.set(2);
      const guard = positionRangeGuard(1, 3);
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });

    it('redirects if user does not have position in range', () => {
      mockAuthService.position.set(5);
      const guard = positionRangeGuard(1, 3);
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  describe('myIdHasPositionMinimumGuard', () => {
    it('allows activation if user has position >= minimum', () => {
      mockAuthService.position.set(5);
      const guard = positionMinimumGuard(3);
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });

    it('redirects if user has position < minimum', () => {
      mockAuthService.position.set(2);
      const guard = positionMinimumGuard(3);
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

  
  describe('isLeaderGuard', () => {
    it('allows activation if user is leader', () => {
      mockAuthService.isLdr.set(true);
      const guard = leaderGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });

    it('redirects if user is NOT leader', () => {
      mockAuthService.isLdr.set(false);
      const guard = leaderGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });
});
