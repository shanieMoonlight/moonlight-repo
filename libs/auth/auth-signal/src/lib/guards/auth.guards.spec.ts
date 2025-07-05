import { PLATFORM_ID, signal, Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { BaseAuthSignalService } from '../base-auth.signal.service';
import {
    createAllRolesGuard,
    createAnyRoleGuard,
    createClaimGuard,
    createCustomGuard,
    createEmailVerifiedGuard,
    createLoggedInGuard,
    createRoleGuard,
} from './auth.guards';

// Mock auth service for testing
class MockAuthService {

    private _isLoggedIn = signal(false);
    private _roles = signal<string[]>([]);
    private _emailVerified = signal(false);
    private _claims = signal<Record<string, unknown>>({});

    isLoggedIn = this._isLoggedIn.asReadonly();
    roles = this._roles.asReadonly();
    emailVerified = this._emailVerified.asReadonly();

    // Test helpers
    setLoggedIn(value: boolean) { this._isLoggedIn.set(value); }
    setRoles(roles: string[]) { this._roles.set(roles); }
    setEmailVerified(value: boolean) { this._emailVerified.set(value); }
    setClaims(claims: Record<string, unknown>) { this._claims.set(claims); }

    hasRole = (role: string): boolean => {
        return this.roles().includes(role);
    }

    hasClaim = (claimType: string, value: unknown): boolean => {
        return this._claims()[claimType] === value;
    }

    protected storeJwt(): Promise<void> { return Promise.resolve(); }
    protected removeJwt(): Promise<void> { return Promise.resolve(); }
    protected getStoredToken(): Promise<string | null> { return Promise.resolve(null); }
    protected logError(): void {
        // Empty implementation for testing
    }
}

describe('Auth Guards', () => {
    const mockUrlTree = Symbol('mockUrlTree') as unknown as UrlTree;
    let mockAuthService: MockAuthService;
    let mockRouter: jest.Mocked<Router>;
    let mockRoute: ActivatedRouteSnapshot;
    let mockState: RouterStateSnapshot;

    beforeEach(() => {
        mockAuthService = new MockAuthService();
        mockRouter = {
            navigate: jest.fn().mockResolvedValue(true),
            createUrlTree: jest.fn().mockReturnValue(mockUrlTree),
        } as unknown as jest.Mocked<Router>;

        mockRoute = {} as ActivatedRouteSnapshot;
        mockState = {} as RouterStateSnapshot;

        TestBed.configureTestingModule({
            providers: [
                { provide: MockAuthService, useValue: mockAuthService },
                { provide: Router, useValue: mockRouter },
                { provide: PLATFORM_ID, useValue: 'browser' }, // <-- add this line
            ],
        });
    });

    describe('createLoggedInGuard', () => {
        it('should allow access when user is logged in', () => {
            mockAuthService.setLoggedIn(true);
            const guard = createLoggedInGuard(MockAuthService as unknown as Type<BaseAuthSignalService>);
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(true);
        });

        it('should deny access when user is not logged in', () => {
            mockAuthService.setLoggedIn(false);
            const guard = createLoggedInGuard(MockAuthService as unknown as Type<BaseAuthSignalService>);
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(false);
        });
    });

    describe('createRoleGuard', () => {
        it('should allow access when user has required role', () => {
            mockAuthService.setLoggedIn(true);
            mockAuthService.setRoles(['admin', 'user']);
            const guard = createRoleGuard(MockAuthService as unknown as Type<BaseAuthSignalService>, 'admin');
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(true);
        });

        it('should deny access when user lacks required role', () => {
            mockAuthService.setLoggedIn(true);
            mockAuthService.setRoles(['user']);
            const guard = createRoleGuard(MockAuthService as unknown as Type<BaseAuthSignalService>, 'admin');
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(false);
        });

        it('should deny access when user is not logged in', () => {
            mockAuthService.setLoggedIn(false);
            const guard = createRoleGuard(MockAuthService as unknown as Type<BaseAuthSignalService>, 'admin');
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(false);
        });
    });

    describe('createClaimGuard', () => {
        it('should allow access when user has required claim value', () => {
            mockAuthService.setLoggedIn(true);
            mockAuthService.setClaims({ 'custom.permission': 'read' });
            const guard = createClaimGuard(MockAuthService as unknown as Type<BaseAuthSignalService>, 'custom.permission', 'read');
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(true);
        });

        it('should deny access when claim value does not match', () => {
            mockAuthService.setLoggedIn(true);
            mockAuthService.setClaims({ 'custom.permission': 'read' });
            const guard = createClaimGuard(MockAuthService as unknown as Type<BaseAuthSignalService>, 'custom.permission', 'write');
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(false);
        });
    });

    describe('createAnyRoleGuard', () => {
        it('should allow access when user has any of the required roles', () => {
            mockAuthService.setLoggedIn(true);
            mockAuthService.setRoles(['user']);
            const guard = createAnyRoleGuard(MockAuthService as unknown as Type<BaseAuthSignalService>, ['admin', 'user', 'moderator']);
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(true);
        });

        it('should deny access when user has none of the required roles', () => {
            mockAuthService.setLoggedIn(true);
            mockAuthService.setRoles(['guest']);
            const guard = createAnyRoleGuard(MockAuthService as unknown as Type<BaseAuthSignalService>, ['admin', 'moderator']);
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(false);
        });
    });

    describe('createAllRolesGuard', () => {
        it('should allow access when user has all required roles', () => {
            mockAuthService.setLoggedIn(true);
            mockAuthService.setRoles(['admin', 'user', 'moderator']);
            const guard = createAllRolesGuard(MockAuthService as unknown as Type<BaseAuthSignalService>, ['admin', 'user']);
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(true);
        });

        it('should deny access when user is missing some required roles', () => {
            mockAuthService.setLoggedIn(true);
            mockAuthService.setRoles(['user']);
            const guard = createAllRolesGuard(MockAuthService as unknown as Type<BaseAuthSignalService>, ['admin', 'user']);
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(false);
        });
    });

    describe('createEmailVerifiedGuard', () => {
        it('should allow access when user is logged in and email is verified', () => {
            mockAuthService.setLoggedIn(true);
            mockAuthService.setEmailVerified(true);
            const guard = createEmailVerifiedGuard(MockAuthService as unknown as Type<BaseAuthSignalService>);
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(true);
        });

        it('should deny access when email is not verified', () => {
            mockAuthService.setLoggedIn(true);
            mockAuthService.setEmailVerified(false);
            const guard = createEmailVerifiedGuard(MockAuthService as unknown as Type<BaseAuthSignalService>);
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(false);
        });
    });


    describe('createCustomGuard', () => {
        it('should allow access when custom check passes', () => {
            mockAuthService.setLoggedIn(true);
            mockAuthService.setRoles(['admin']);

            const customCheck = (authService: BaseAuthSignalService) =>
                authService.isLoggedIn() && authService.hasRole('admin');

            const guard = createCustomGuard(MockAuthService as unknown as Type<BaseAuthSignalService>, customCheck);
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(true);
        });

        it('should deny access when custom check fails', () => {
            mockAuthService.setLoggedIn(false);

            const customCheck = (authService: BaseAuthSignalService) =>
                authService.isLoggedIn() && authService.hasRole('admin');

            const guard = createCustomGuard(MockAuthService as unknown as Type<BaseAuthSignalService>, customCheck);
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(false);
        });

        it('should return correct UrlTree when custom check fails and redirect URL is provided', () => {
            mockAuthService.setLoggedIn(false);

            const customCheck = (authService: BaseAuthSignalService) =>
                authService.isLoggedIn();

            const guard = createCustomGuard(MockAuthService as unknown as Type<BaseAuthSignalService>, customCheck, '/login');
            const result = TestBed.runInInjectionContext(() => guard(mockRoute, mockState));
            expect(result).toBe(mockUrlTree);
            expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/login']);
        });
    });
});
