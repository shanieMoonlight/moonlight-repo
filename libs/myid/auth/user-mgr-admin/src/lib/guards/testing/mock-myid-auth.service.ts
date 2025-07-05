import { signal } from '@angular/core';
import { of } from 'rxjs';

// Minimal role/position values for testing
export const MockRoleValues = {
  TEAM_LEADER: 'leader',
  ADMIN: 'admin',
  USER: 'user',
  MGR: 'mgr',
  GUEST: 'guest',
};
export const MockTeamPositions = {
  ADMIN: 3,
  USER: 1,
  MGR: 2,
  GUEST: 0,
};

// Plain mock class for MyIdAuthService/AMyIdAuthService, no extends, no DI
export class MockUserMgrAdminAuthService  {

  isReady$ = of(true) 

  getPositionValue(): number {
    throw new Error('Method not implemented.');
  }
  // Signals for claims and roles
  position = signal<number>(-1);
  roles = signal<string[]>([]);
  isLoggedIn = signal<boolean>(false);
  emailVerified = signal<boolean>(false);
  claims = signal<Record<string, unknown>>({});
  teamId = signal<string>('');
  teamType = signal<string>('');

  // Computed properties for team/role/position guards
  isLdr = signal<boolean>(false);
  isUser = signal<boolean>(false);
  isMgr = signal<boolean>(false);
  isAdmin = signal<boolean>(false);
  isGuest = signal<boolean>(false);

  // Add all minimum/composite signals as plain signals for test overrides
  isSuper = signal<boolean>(false);
  isMntc = signal<boolean>(false);
  isCustomer = signal<boolean>(false);

  isSuperLdr = signal<boolean>(false);
  isSuperPosition = jest.fn((position: number) => signal(false))
  isSuperPositionMinimum = jest.fn((position: number) => signal(false))

  isSuperAdmin = signal<boolean>(false);
  isSuperMgr = signal<boolean>(false);
  isSuperUser = signal<boolean>(false);
  isSuperGuest = signal<boolean>(false);

  isMntcLdr = signal<boolean>(false);

  isMntcPosition = jest.fn((position: number) => signal(false))
  isMntcPositionMinimum = jest.fn((position: number) => signal(false))

  isMntcAdmin = signal<boolean>(false);
  isMntcMgr = signal<boolean>(false);
  isMntcUser = signal<boolean>(false);
  isMntcGuest = signal<boolean>(false);


  isCusLdr = signal<boolean>(false);
  isCusPosition = jest.fn((position: number) => signal(false))
  isCusPositionMinimum = jest.fn((position: number) => signal(false))

  isCusAdmin = signal<boolean>(false);
  isCusMgr = signal<boolean>(false);
  isCusUser = signal<boolean>(false);
  isCusGuest = signal<boolean>(false);

  isSuperLdrMinimum = signal<boolean>(false);
  isSuperAdminMinimum = signal<boolean>(false);
  isSuperMgrMinimum = signal<boolean>(false);
  isSuperUserMinimum = signal<boolean>(false);
  isSuperGuestMinimum = signal<boolean>(false);
  isSuperMinimum = signal<boolean>(false);

  isMntcLdrMinimum = signal<boolean>(false);
  isMntcAdminMinimum = signal<boolean>(false);
  isMntcMgrMinimum = signal<boolean>(false);
  isMntcUserMinimum = signal<boolean>(false);
  isMntcGuestMinimum = signal<boolean>(false);
  isMntcMinimum = signal<boolean>(false);

  isCusLdrMinimum = signal<boolean>(false);
  isCusAdminMinimum = signal<boolean>(false);
  isCusMgrMinimum = signal<boolean>(false);
  isCusUserMinimum = signal<boolean>(false);
  isCusGuestMinimum = signal<boolean>(false);
  isCusMinimum = signal<boolean>(false);

  isMntcOrDev = signal<boolean>(false);
  isMntcMinimumOrDev = signal<boolean>(false);
  isSuperOrDev = signal<boolean>(false);
  isSuperMinimumOrDev = signal<boolean>(false);

  // Test helpers
  setPosition(val: number) { this.position.set(val); }
  setRoles(val: string[]) { this.roles.set(val); }
  setLoggedIn(val: boolean) { this.isLoggedIn.set(val); }
  setEmailVerified(val: boolean) { this.emailVerified.set(val); }
  setClaims(val: Record<string, unknown>) { this.claims.set(val); }
  setSignal(signalName: keyof this, value: any) { (this[signalName] as any).set(value); }

  // Methods mimicking AMyIdAuthService
  hasRole = jest.fn((role: string) => this.roles().includes(role));
  hasClaim = jest.fn((claimType: string, value: unknown) => this.claims()[claimType] === value);
  hasTeamTypeClaim = jest.fn((type: string) => this.hasClaim('myid.team_type', type));
  getClaimValue = jest.fn((key: string) => this.claims()[key]);
  getTeamPositionValue = jest.fn(() => this.position());
  hasPosition = jest.fn((pos: number) => this.position() === pos);

  hasPositionOrHigher = (position: number) =>
    this.position() >= position;
}
