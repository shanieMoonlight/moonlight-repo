import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BaseAuthSignalService } from './base-auth.signal.service';
import { JwtPayload } from './jwt/jwt-payload';
import { LogErrorContext } from './logging/log-error-context';

// Dummy JWT for testing
const TEST_JWT = {
    sub: '123',
    name: 'Alice',
    email: 'alice@example.com',
    role: ['admin', 'user'],
    iat: Math.floor(Date.now() / 1000) - 60,
    exp: Math.floor(Date.now() / 1000) + 3600,
    email_verified: true,
    given_name: 'Alice',
    family_name: 'Smith',
} as JwtPayload;

// Helper to create a fake JWT string (not actually signed)
function fakeJwt(payload: object): string {
    return [
        btoa(JSON.stringify({ alg: 'none', typ: 'JWT' })),
        btoa(JSON.stringify(payload)),
        ''
    ].join('.');
}

class TestAuthService extends BaseAuthSignalService<JwtPayload> {
    protected override removeJwt(): void { this.storedToken = null; }
    protected override getStoredToken(): Promise<string | null> {return Promise.resolve(this.storedToken)     }
    public storedToken: string | null = null;
    public errorLog: LogErrorContext[] = [];
    protected storeJwt(token: string) { this.storedToken = token; }
    protected logError(logData: LogErrorContext) { this.errorLog.push(logData); }
}

describe('BaseAuthSignalService', () => {
    let service: TestAuthService;

    let jwt: string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: PLATFORM_ID, useValue: 'browser' },
                TestAuthService,
            ],
        });
        service = TestBed.inject(TestAuthService);
        jwt = fakeJwt(TEST_JWT);
    });

    it('should log in and decode claims', () => {
        service.logIn(jwt);
        expect(service.isLoggedIn()).toBe(true);
        expect(service.userName()).toBe('Alice');
        expect(service.userId()).toBe('123');
        expect(service.email()).toBe('alice@example.com');
        expect(service.roles()).toEqual(['admin', 'user']);
        expect(service.emailVerified()).toBe(true);
        expect(service.firstName()).toBe('Alice');
        expect(service.lastName()).toBe('Smith');
        expect(service.storedToken).toBe(jwt);
    });

    it('should log out and clear claims', () => {
        service.logIn(jwt);
        service.logOut();
        expect(service.isLoggedIn()).toBe(false);
        expect(service.userName()).toBeUndefined();
        expect(service.storedToken).toBeNull(); // storeJwt is not called on logout
    });

    it('should detect claim presence and value', () => {
        service.logIn(jwt);
        expect(service.hasClaimType('email')).toBe(true);
        expect(service.hasClaim('email', 'alice@example.com')).toBe(true);
        expect(service.hasClaim('role', 'admin')).toBe(false); // role is array
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(service.hasClaimType('not_a_claim' as any)).toBe(false);
    });

    it('should extract all claims as record and array', () => {
        service.logIn(jwt);
        const claimsRecord = service.allClaimsRecord();
        expect(claimsRecord['name'].value).toBe('Alice');
        expect(Array.isArray(service.allClaims())).toBe(true);
        expect(service.allClaims().some(c => c.type === 'email')).toBe(true);
    });



    it('should handle token expiry and call onExpiry 2', async () => {
        const soonExpiring = { ...TEST_JWT, exp: Math.floor(Date.now() / 1000) + 0.01 };
        const soonJwt = fakeJwt(soonExpiring);
        service.logIn(soonJwt);
        expect(service.isLoggedIn()).toBe(true);
        await new Promise(res => setTimeout(res, 20));
        expect(service.isLoggedIn()).toBe(false);
    });

    it('should log errors on decode failure', () => {
        service.logIn('not.a.jwt');
        expect(service.isLoggedIn()).toBe(false);
        expect(service.errorLog.length).toBeGreaterThan(0);
        expect(service.errorLog[0].method).toBe('decodeToken');
    });
});
