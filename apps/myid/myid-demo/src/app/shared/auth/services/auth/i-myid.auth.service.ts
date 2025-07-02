import { Signal } from '@angular/core';



export interface IMyIdAuthService {
  // Signals and computed properties
  isSuper: Signal<boolean>;
  isMntc: Signal<boolean>;
  isCustomer: Signal<boolean>;
  isLdr: Signal<boolean>;
  isUser: Signal<boolean>;
  isMgr: Signal<boolean>;
  isAdmin: Signal<boolean>;
  isGuest: Signal<boolean>;
  teamId: Signal<string>;
  teamType: Signal<string>;
  position: Signal<number>;
  isSuperLdr: Signal<boolean>;
  isSuperAdmin: Signal<boolean>;
  isSuperMgr: Signal<boolean>;
  isSuperUser: Signal<boolean>;
  isSuperGuest: Signal<boolean>;
  isMntcLdr: Signal<boolean>;
  isMntcAdmin: Signal<boolean>;
  isMntcMgr: Signal<boolean>;
  isMntcUser: Signal<boolean>;
  isMntcGuest: Signal<boolean>;
  isCusLdr: Signal<boolean>;
  isCusAdmin: Signal<boolean>;
  isCusMgr: Signal<boolean>;
  isCusUser: Signal<boolean>;
  isCusGuest: Signal<boolean>;
  isSuperLdrMinimum: Signal<boolean>;
  isSuperAdminMinimum: Signal<boolean>;
  isSuperMgrMinimum: Signal<boolean>;
  isSuperUserMinimum: Signal<boolean>;
  isSuperGuestMinimum: Signal<boolean>;
  isSuperMinimum: Signal<boolean>;
  isMntcLdrMinimum: Signal<boolean>;
  isMntcAdminMinimum: Signal<boolean>;
  isMntcMgrMinimum: Signal<boolean>;
  isMntcUserMinimum: Signal<boolean>;
  isMntcGuestMinimum: Signal<boolean>;
  isMntcMinimum: Signal<boolean>;
  isCusLdrMinimum: Signal<boolean>;
  isCusAdminMinimum: Signal<boolean>;
  isCusMgrMinimum: Signal<boolean>;
  isCusUserMinimum: Signal<boolean>;
  isCusGuestMinimum: Signal<boolean>;
  isCusMinimum: Signal<boolean>;
  isMntcOrDev: Signal<boolean>;
  isMntcMinimumOrDev: Signal<boolean>;
  isSuperOrDev: Signal<boolean>;
  isSuperMinimumOrDev: Signal<boolean>;

  // Parameterized computed properties
  isSuperPosition(position: number): Signal<boolean>;
  isMntcPosition(position: number): Signal<boolean>;

  // Methods
  hasTeamTypeClaim(type: string): boolean;
  getTeamPositionValue(): number;
  hasClaim(claimType: string, value: unknown): boolean;
  hasRole(role: string): boolean;
}
