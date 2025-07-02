import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { MY_ID_AUTH_SERVICE_TOKEN } from './myid-auth-guard.config';
import { superGuard, superLdrGuard, superMinimumGuard, superMinimumOrDevGuard, superOrDevGuard, superPositionGuard, superPositionMinimumGuard, superPositionRangeGuard } from './super-team-guards';
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

  describe('superGuard', () => {
    it('allows activation if isSpr is true', () => {
      mockAuthService.isSuper.set(true);
      const guard = superGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSpr is false', () => {
      mockAuthService.isSuper.set(false);
      const guard = superGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

//-------------------//

  describe('superLdr', () => {
    it('allows activation if isSuperLdr is true', () => {
      mockAuthService.isSuperLdr.set(true);
      const guard = superLdrGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSuperLdr is false', () => {
      mockAuthService.isSuperLdr.set(false);
      const guard = superLdrGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

//-------------------//

  describe('superMinimumGuard', () => {
    it('allows activation if isSuperMinimum is true', () => {
      mockAuthService.isSuperMinimum.set(true);
      const guard = superMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSuper is false', () => {
      mockAuthService.isSuperMinimum.set(false);
      const guard = superMinimumGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

//-------------------//

  describe('superOrDevGuard', () => {
    it('allows activation if isSuperOrDev is true', () => {
      mockAuthService.isSuperOrDev.set(true);
      const guard = superOrDevGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSuperOrDev is false', () => {
      mockAuthService.isSuperOrDev.set(false);
      const guard = superOrDevGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

//-------------------//

  describe('superMinimumOrDevGuard', () => {
    it('allows activation if isSuperMinimumOrDev is true', () => {
      mockAuthService.isSuperMinimumOrDev.set(true);
      const guard = superMinimumOrDevGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });
    it('redirects if isSuperOrDev is false', () => {
      mockAuthService.isSuperMinimumOrDev.set(false);
      const guard = superMinimumOrDevGuard;
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalled();
    });
  });

//-------------------//

 describe('superPositionGuard', () => {
        it('allows activation if user has super position', () => {
            mockAuthService.isSuperPosition.mockReturnValue(signal(true));
            const guard = superPositionGuard(2);
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(true);
        });


        it('redirects if user does not have super position', () => {
            const guard = superPositionGuard(2);
            mockAuthService.isSuperPosition.mockReturnValue(signal(false));
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(mockUrlTree);
        });
    });

//-------------------//

    describe('superPositionMinimumGuard', () => {
        it('allows activation if user has super positionMinimum', () => {
            mockAuthService.isSuperPositionMinimum.mockReturnValue(signal(true));
            const guard = superPositionMinimumGuard(2);
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(true);
        });


        it('redirects if user does not have super positionMinimum', () => {
            const guard = superPositionMinimumGuard(3);
            mockAuthService.isSuperPositionMinimum.mockReturnValue(signal(false));
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(mockUrlTree);
        });
    });

//-------------------//


  describe('superPositionRangeGuard', () => {
    it('allows activation if  user has super positionRange', () => {
      mockAuthService.position.set(2);
      mockAuthService.isSuper.set(true);
      const guard = superPositionRangeGuard(1,3);
      const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(true);
    });

    it('redirects if user does not have super positionRange', () => {
      const guard = superPositionRangeGuard(1,3);

      mockAuthService.position.set(0);//below minimum
      mockAuthService.isSuper.set(true);// super
      let result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);

      
      mockAuthService.position.set(0); //lower than minimum
      mockAuthService.isSuper.set(false); // not super
       result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      
      mockAuthService.position.set(5); //above minimum
      mockAuthService.isSuper.set(true);// super
       result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);

      
      mockAuthService.position.set(5); //above minimum
      mockAuthService.isSuper.set(false);// not super
       result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
      
      mockAuthService.position.set(2); //within range
      mockAuthService.isSuper.set(false);// not super
       result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
      expect(result).toBe(mockUrlTree);
    });
  });

//-------------------//


});
