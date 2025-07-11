import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { lastValueFrom, Observable, of } from 'rxjs';
import { MY_ID_AUTH_SERVICE_TOKEN } from './config/myid-auth-guard.config';
import {
    mntcGuard,
    mntcLdrGuard,
    mntcMinimumGuard,
    mntcMinimumOrDevGuard,
    mntcOrDevGuard,
    mntcPositionGuard,
    mntcPositionMinimumGuard,
    mntcPositionRangeGuard
} from './mntc-team-guards';
import { MockMyIdAuthService } from './testing/mock-myid-auth.service';

const mockActRoute = {
    queryParamMap: of({ get: () => null })
};

describe('Mntc Team Guards', () => {
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
    describe('mntcGuard', () => {
        it('allows activation if isMntc is true', async () => {
            mockAuthService.isMntc.set(true);
            const guard = mntcGuard;
            const result$ = TestBed.runInInjectionContext(() =>
                guard(mockRoute, mockState)
            ) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(true);
        });

        it('redirects if isMntc is false', async () => {
            mockAuthService.isMntc.set(false);
            const guard = mntcGuard;
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
            expect(mockRouter.createUrlTree).toHaveBeenCalled();
        });
    });

    //-------------------//

    describe('mntcLdrGuard', () => {
        it('allows activation if isMntcLdr is true', async () => {
            mockAuthService.isMntcLdr.set(true);
            const guard = mntcLdrGuard;
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(true);
        });
        it('redirects if isMntcLdr is false', async () => {
            mockAuthService.isMntcLdr.set(false);
            const guard = mntcLdrGuard;
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
            expect(mockRouter.createUrlTree).toHaveBeenCalled();
        });
    });

    //-------------------//

    describe('mntcMinimumGuard', () => {
        it('allows activation if isMntcMinimum is true', async () => {
            mockAuthService.isMntcMinimum.set(true);
            const guard = mntcMinimumGuard;
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(true);
        });
        it('redirects if isMntcMinimum is false', async () => {
            mockAuthService.isMntcMinimum.set(false);
            const guard = mntcMinimumGuard;
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
            expect(mockRouter.createUrlTree).toHaveBeenCalled();
        });
    });

    //-------------------//

    describe('mntcOrDevGuard', () => {
        it('allows activation if isMntcOrDev is true', async () => {
            mockAuthService.isMntcOrDev.set(true);
            const guard = mntcOrDevGuard;
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(true);
        });
        it('redirects if isMntcOrDev is false', async () => {
            mockAuthService.isMntcOrDev.set(false);
            const guard = mntcOrDevGuard;
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
            expect(mockRouter.createUrlTree).toHaveBeenCalled();
        });
    });

    //-------------------//

    describe('mntcMinimumOrDevGuard', () => {
        it('allows activation if isMntcMinimumOrDev is true', async () => {
            mockAuthService.isMntcMinimumOrDev.set(true);
            const guard = mntcMinimumOrDevGuard;
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(true);
        });
        it('redirects if isMntcMinimumOrDev is false', async () => {
            mockAuthService.isMntcMinimumOrDev.set(false);
            const guard = mntcMinimumOrDevGuard;
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
            expect(mockRouter.createUrlTree).toHaveBeenCalled();
        });
    });

    //-------------------//

    describe('mntcPositionGuard', () => {
        it('allows activation if user has mntc position', async () => {
            mockAuthService.isMntcPosition.mockReturnValue(signal(true));
            const guard = mntcPositionGuard(2);
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(true);
        });

        it('redirects if user does not have mntc position', async () => {
            const guard = mntcPositionGuard(2);
            mockAuthService.isMntcPosition.mockReturnValue(signal(false));
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
        });
    });

    //-------------------//

    describe('mntcPositionMinimumGuard', () => {
        it('allows activation if user has mntc positionMinimum', async () => {
            mockAuthService.isMntcPositionMinimum.mockReturnValue(signal(true));
            const guard = mntcPositionMinimumGuard(2);
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(true);
        });

        it('redirects if user does not have mntc positionMinimum', async () => {
            const guard = mntcPositionMinimumGuard(3);
            mockAuthService.isMntcPositionMinimum.mockReturnValue(signal(false));
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
        });
    });

    //-------------------//

    describe('mntcPositionRangeGuard', () => {
        it('allows activation if user has mntc positionRange', async () => {
            mockAuthService.position.set(2);
            mockAuthService.isMntc.set(true);
            const guard = mntcPositionRangeGuard(1, 3);
            const result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(true);
        });
        it('redirects if user does not have mntc positionRange', async () => {
            const guard = mntcPositionRangeGuard(1, 3);
            mockAuthService.position.set(0);
            mockAuthService.isMntc.set(true);
            let result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
            mockAuthService.position.set(0);
            mockAuthService.isMntc.set(false);
            result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
            mockAuthService.position.set(5);
            mockAuthService.isMntc.set(true);
            result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
            mockAuthService.position.set(5);
            mockAuthService.isMntc.set(false);
            result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
            mockAuthService.position.set(2);
            mockAuthService.isMntc.set(false);
            result$ = TestBed.runInInjectionContext(() => guard(mockRoute, mockState)) as Observable<boolean | UrlTree>;
            await expect(lastValueFrom(result$)).resolves.toBe(mockUrlTree);
        });
    });

});
