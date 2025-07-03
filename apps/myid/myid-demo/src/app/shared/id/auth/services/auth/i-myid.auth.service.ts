import { Signal } from '@angular/core';


//Helps with testing and mocking
export interface IMyIdAuthService {
  // Signals and computed properties (generic only)
  isLdr: Signal<boolean>;
  teamId: Signal<string>;
  teamType: Signal<string>;
  position: Signal<number>;

  isSuper: Signal<boolean>;
  isMntc: Signal<boolean>;
  isCustomer: Signal<boolean>;
  isSuperLdr: Signal<boolean>;
  isSuperPosition(position: number): Signal<boolean>;
  isMntcLdr: Signal<boolean>;
  isMntcPosition(position: number): Signal<boolean>;
  isCusLdr: Signal<boolean>;
  isCusPosition(position: number): Signal<boolean>;
  isSuperPositionMinimum(position: number): Signal<boolean>;
  isSuperMinimum: Signal<boolean>;
  isMntcLdrMinimum: Signal<boolean>;
  isMntcPositionMinimum(position: number): Signal<boolean>;
  isMntcMinimum: Signal<boolean>;
  isCusLdrMinimum: Signal<boolean>;
  isCusPositionMinimum(position: number): Signal<boolean>;
  isCusMinimum: Signal<boolean>;
  isMntcOrDev: Signal<boolean>;
  isMntcMinimumOrDev: Signal<boolean>;
  isSuperOrDev: Signal<boolean>;
  isSuperMinimumOrDev: Signal<boolean>;

  // Methods
  hasTeamTypeClaim(type: string): boolean;
  getPositionValue(): number;
  hasClaim(claimType: string, value: unknown): boolean;
  hasRole(role: string): boolean;
}
