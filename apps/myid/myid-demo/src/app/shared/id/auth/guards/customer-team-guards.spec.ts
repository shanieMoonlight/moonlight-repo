import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { cusLdrGuard, cusMinimumGuard, cusPositionGuard, cusPositionMinimumGuard, cusPositionRangeGuard, customerGuard } from './customer-team-guards';
import { MY_ID_AUTH_SERVICE_TOKEN } from './config/myid-auth-guard.config';
import { MockMyIdAuthService } from './testing/mock-myid-auth.service';

const mockActRoute = {
    queryParamMap: of({ get: () => null })
};

describe('Customer Team Guards', () => {
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

    //-------------------//

    describe('customerGuard', () => {
        it('allows activation if isCustomer is true', () => {
            mockAuthService.isCustomer.set(true);
            const guard = customerGuard;
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(true);
        });
        it('redirects if isCustomer is false', () => {
            mockAuthService.isCustomer.set(false);
            const guard = customerGuard;
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(mockUrlTree);
            expect(mockRouter.createUrlTree).toHaveBeenCalled();
        });
    });

    //-------------------//

    describe('cusLdrGuard', () => {
        it('allows activation if isCusLdr is true', () => {
            mockAuthService.isCusLdr.set(true);
            const guard = cusLdrGuard;
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(true);
        });
        it('redirects if isCusLdr is false', () => {
            mockAuthService.isCusLdr.set(false);
            const guard = cusLdrGuard;
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(mockUrlTree);
            expect(mockRouter.createUrlTree).toHaveBeenCalled();
        });
    });

    //-------------------//

    describe('cusMinimumGuard', () => {
        it('allows activation if isCusMinimum is true', () => {
            mockAuthService.isCusMinimum.set(true);
            const guard = cusMinimumGuard;
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(true);
        });


        it('redirects if isCusMinimum is false', () => {
            mockAuthService.isCusMinimum.set(false);
            const guard = cusMinimumGuard;
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(mockUrlTree);
            expect(mockRouter.createUrlTree).toHaveBeenCalled();
        });
    });

    //-------------------//

    describe('cusPositionGuard', () => {
        it('allows activation if user has cus position', () => {
            mockAuthService.isCusPosition.mockReturnValue(signal(true));
            const guard = cusPositionGuard(2);
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(true);
        });


        it('redirects if user does not have cus position', () => {
            const guard = cusPositionGuard(2);
            mockAuthService.isCusPosition.mockReturnValue(signal(false));
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(mockUrlTree);
        });
    });

    //-------------------//


    describe('cusPositionMinimumGuard', () => {
        it('allows activation if user has cus positionMinimum', () => {
            mockAuthService.isCusPositionMinimum.mockReturnValue(signal(true));
            const guard = cusPositionMinimumGuard(2);
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(true);
        });


        it('redirects if user does not have cus positionMinimum', () => {
            const guard = cusPositionMinimumGuard(3);
            mockAuthService.isCusPositionMinimum.mockReturnValue(signal(false));
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(mockUrlTree);
        });
    });

    //-------------------//

    describe('cusPositionRangeGuard', () => {
        it('allows activation if user has cus positionRange', () => {
            mockAuthService.position.set(2);
            mockAuthService.isCustomer.set(true);
            const guard = cusPositionRangeGuard(1, 3);
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(true);
        });

        it('redirects if user does not have cus positionRange', () => {
            const guard = cusPositionRangeGuard(1, 3);
            mockAuthService.position.set(0);
            mockAuthService.isCustomer.set(true);
            let result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(mockUrlTree);
            mockAuthService.position.set(0);
            mockAuthService.isCustomer.set(false);
            result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(mockUrlTree);

            mockAuthService.position.set(5);
            mockAuthService.isCustomer.set(true);
            result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(mockUrlTree);

            mockAuthService.position.set(5);
            mockAuthService.isCustomer.set(false);
            result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(mockUrlTree);

            mockAuthService.position.set(2);
            mockAuthService.isCustomer.set(false);
            result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(mockUrlTree);
        });
    });

});
