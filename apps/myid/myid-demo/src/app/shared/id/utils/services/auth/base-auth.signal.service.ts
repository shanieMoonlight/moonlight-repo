import { isPlatformBrowser } from '@angular/common';
import { Directive, PLATFORM_ID, Signal, WritableSignal, computed, inject, isDevMode, signal } from '@angular/core';
import { StringHelpers } from '../../dates/string-helpers';
import { DateHelpers } from '../../dates/date-helpers';
import { MyIdClaimNames } from './claim-names';
import { Claim } from './claim';
import { JwtHelper } from './jwt-helper';

@Directive({})
export abstract class BaseAuthSignalService  {

  protected _platformId = inject(PLATFORM_ID)

  //- - - - - - - - - - - - -//

  protected _accessToken: WritableSignal<string | null> = signal(null)
  accessToken$ = computed(() => this._accessToken())

  decodedToken$ = computed(() => this.decodeToken(this._accessToken()))

  allClaimsRecord$ = computed(() => this.extractAllClaimsRecord(this.decodedToken$()))
  allClaims$ = computed(() => Object.values(this.allClaimsRecord$()))

  //- - - - - - - - - - - - -//
  abstract isLoggedIn$: Signal<boolean>
  abstract isNotLoggedIn$: Signal<boolean>
  //- - - - - - - - - - - - -//

  userName$ = computed(() => this.getClaimValue(MyIdClaimNames.NAME))
  userId$ = computed(() => this.getClaimValue(MyIdClaimNames.USER_ID))
  email$ = computed(() => this.getClaimValue(MyIdClaimNames.EMAIL))

  issuer$ = computed(() => this.getClaimValue(MyIdClaimNames.ISSUER))
  audience$ = computed(() => this.getClaimValue(MyIdClaimNames.AUDIENCE))
  emailVerified$ = computed(() => this.getClaimValue(MyIdClaimNames.EMAIL_VERIFIED))

  issuedAt$ = computed(() => DateHelpers.fromSeconds(this.getClaimValue(MyIdClaimNames.ISSUED_AT)))
  expiry$ = computed(() => DateHelpers.fromSeconds(this.getClaimValue(MyIdClaimNames.EXPIRY)))
  notBefore$ = computed(() => DateHelpers.fromSeconds(this.getClaimValue(MyIdClaimNames.NOT_VALID_BEFORE)))
  authTime$ = computed(() => DateHelpers.fromSeconds(this.getClaimValue(MyIdClaimNames.AUTH_TIME)))

  //- - - - - - - - - - - - -//

  isInDevMode$ = signal(isDevMode())

  //-------------------//

  protected abstract storeJwt(accessToken: string): void
  protected abstract logError(logData: any): void

  //-------------------//

  /**
   * @param storedToken Used to populate the Signals
   */
  constructor(storedToken?: (string | null | undefined) | Promise<string | null | undefined>) {

// console.log('AuthRolesService', storedToken);


    if (StringHelpers.isString(storedToken))
      this._accessToken.set(storedToken ?? null)
    else
      storedToken?.then(tkn => this._accessToken.set(tkn ?? null))
    
  }

  //-------------------//

  /**Read in jwt info*/
  logIn(accessToken: string): void {
    this.storeJwt(accessToken)
    this._accessToken.set(accessToken ?? null)
  }

  //-------------------//

  /**Log out current user - delete jwt and reset all fields*/
  logOut = (): void => this._accessToken.set(null)

  //-------------------//

  /**
   * Cheks if there is an in-date toke stored
   */
  protected isTokenStillValid = (): boolean =>
    new Date() < this.expiry$()

  //-------------------//

  hasClaimType = (claimName: string): boolean =>
    !!claimName && !!this.allClaimsRecord$()[claimName]

  //- - - - - - - - - - - - -//

  hasClaim = (claim: Claim): boolean =>
    !!claim && this.allClaimsRecord$()?.[claim.type]?.value == claim.value

  //- - - - - - - - - - - - -//

  getClaim(claimName: string): Claim | null {

    if (!claimName)
      return null

    return this.allClaimsRecord$()[claimName]

  }

  //- - - - - - - - - - - - -//

  getClaimValue = (claimName: string): any =>
    this.decodedToken$()?.[claimName]

  //-------------------//

  /**Read the stored JWT */
  private decodeToken(accessToken?: string | null): any | null {

    try {
      if (!accessToken)
        return null

      return JwtHelper.decodeToken(accessToken)

    } catch (error) {
      console.log('decodeTokenError', error)
      this.logError(error);
      return null
    }

  }

  //-------------------//

  /**
   * Collect all claims and put them in an array
   * @param parsedToken parsed JWT access token
   */
  private extractAllClaimsRecord(parsedToken: any): Record<string, Claim> {

    const claimsRecord: Record<string, Claim> = {}

    if (!parsedToken)
      return claimsRecord

    const issuer = parsedToken[MyIdClaimNames.ISSUER]
    const userId = parsedToken[MyIdClaimNames.USER_ID]

    for (const key in parsedToken)
      claimsRecord[key] = Claim.CreateWithIssuer(issuer, userId, key, parsedToken[key])

    return claimsRecord

  }

  //-------------------//

  protected isPlatformBrowser = () =>
    isPlatformBrowser(this._platformId)

} //Cls
