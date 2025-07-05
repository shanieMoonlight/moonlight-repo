import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { lastValueFrom, of, Observable } from 'rxjs';
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
                { provide: MockMyIdAuthService, useValue: mockAuthService },
                { provide: MY_ID_AUTH_SERVICE_TOKEN, useValue: mockAuthService },
                { provide: Router, useValue: mockRouter },
            ],
        });
    });

    //-------------------//


    describe('customerGuard', () => {
        it('allows activation if isCustomer is true', async () => {
            mockAuthService.isCustomer.set(true);
            const guard = customerGuard;
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(true);
        });
        it('redirects if isCustomer is false', async () => {
            mockAuthService.isCustomer.set(false);
            const guard = customerGuard;
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
            expect(mockRouter.createUrlTree).toHaveBeenCalled();
        });
    });

    //-------------------//

    describe('cusLdrGuard', () => {
        it('allows activation if isCusLdr is true', async () => {
            mockAuthService.isCusLdr.set(true);
            const guard = cusLdrGuard;
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(true);
        });
        it('redirects if isCusLdr is false', async () => {
            mockAuthService.isCusLdr.set(false);
            const guard = cusLdrGuard;
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
            expect(mockRouter.createUrlTree).toHaveBeenCalled();
        });
    });

    //-------------------//

    describe('cusMinimumGuard', () => {
        it('allows activation if isCusMinimum is true', async () => {
            mockAuthService.isCusMinimum.set(true);
            const guard = cusMinimumGuard;
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(true);
        });
        it('redirects if isCusMinimum is false', async () => {
            mockAuthService.isCusMinimum.set(false);
            const guard = cusMinimumGuard;
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
            expect(mockRouter.createUrlTree).toHaveBeenCalled();
        });
    });

    //-------------------//

    describe('cusPositionGuard', () => {
        it('allows activation if user has cus position', async () => {
            mockAuthService.isCusPosition.mockReturnValue(signal(true));
            const guard = cusPositionGuard(2);
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(true);
        });
        it('redirects if user does not have cus position', async () => {
            const guard = cusPositionGuard(2);
            mockAuthService.isCusPosition.mockReturnValue(signal(false));
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
        });
    });

    //-------------------//

    describe('cusPositionMinimumGuard', () => {
        it('allows activation if user has cus positionMinimum', async () => {
            mockAuthService.isCusPositionMinimum.mockReturnValue(signal(true));
            const guard = cusPositionMinimumGuard(2);
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(true);
        });
        it('redirects if user does not have cus positionMinimum', async () => {
            const guard = cusPositionMinimumGuard(2);
            mockAuthService.isCusPositionMinimum.mockReturnValue(signal(false));
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
        });
    });

    //-------------------//

    describe('cusPositionRangeGuard', () => {
        it('allows activation if user has cus positionRange', async () => {
            mockAuthService.position.set(2);
            mockAuthService.isCustomer.set(true);
            const guard = cusPositionRangeGuard(1, 3);
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(true);
        });
        it('redirects if user does not have cus positionRange', async () => {
            const guard = cusPositionRangeGuard(1, 3);
            mockAuthService.position.set(0);
            mockAuthService.isCustomer.set(true);
            let result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
            mockAuthService.position.set(0);
            mockAuthService.isCustomer.set(false);
            result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
            mockAuthService.position.set(5);
            mockAuthService.isCustomer.set(true);
            result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
            mockAuthService.position.set(5);
            mockAuthService.isCustomer.set(false);
            result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
            mockAuthService.position.set(2);
            mockAuthService.isCustomer.set(false);
            result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
        });
    });

});
