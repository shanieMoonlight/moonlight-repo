// import { isPlatformBrowser } from '@angular/common';
// import { Directive, PLATFORM_ID, WritableSignal, computed, inject, isDevMode, signal } from '@angular/core';
// import { devConsole } from '@spider-baby/dev-console';
// import { DateHelpers } from '../../../../utils/dates/date-helpers';
// import { StringHelpers } from '../../../../utils/strings/string-helpers';
// import { Claim } from './claims/claim';
// import { MyIdClaimNames } from './claims/claim-names';
// import { JwtHelper } from './jwt/jwt-helper';
// import { JwtPayload } from './jwt/jwt-payload';
// import { LogErrorContext } from './utils/log-error-context';

// @Directive({})
// export abstract class BaseAuthSignalService<JWT extends JwtPayload = JwtPayload> {

//   protected _platformId = inject(PLATFORM_ID)

//   //- - - - - - - - - -//

//   /** Writable signal holding the current JWT access token */
//   private _accessToken: WritableSignal<string | null> = signal(null)

//   /** Signal for the current access token value */
//   accessToken = computed(() => this._accessToken())

//   /** Signal for the decoded JWT token object */
//   decodedToken = computed(() => this.decodeToken(this._accessToken()))

//   /** Signal for all claims as a record (key-value pairs) */
//   allClaimsRecord = computed(() => this.extractAllClaimsRecord(this.decodedToken()))
//   /** Signal for all claims as an array */
//   allClaims = computed(() => Object.values(this.allClaimsRecord()))

//   //- - - - - - - - - -//

//   /** Signal: true if a valid JWT is present */
//   isLoggedIn = computed(() => !!this.decodedToken());
//   /** Signal: true if no valid JWT is present */
//   isNotLoggedIn = computed(() => !this.isLoggedIn());

//   //- - - - - - - - - -//

//   /** Signal for the user's name claim */
//   userName = computed(() =>
//     this.getClaimValue<string>(MyIdClaimNames.NAME)
//   )
//   /** Signal for the user's ID claim */
//   userId = computed(() =>
//     this.getClaimValue<string>(MyIdClaimNames.USER_ID)
//   )
//   /** Signal for the user's email claim */
//   email = computed(() =>
//     this.getClaimValue('email')
//   )

//   /** Signal for the issuer claim */
//   issuer = computed(() =>
//     this.getClaimValue<string>(MyIdClaimNames.ISSUER))
//   /** Signal for the audience claim */
//   audience = computed(() =>
//     this.getClaimValue<string>(MyIdClaimNames.AUDIENCE)
//   )
//   /** Signal for the email verified claim */
//   emailVerified = computed(() =>
//     this.getClaimValue<boolean>(MyIdClaimNames.EMAIL_VERIFIED) ?? false
//   )

//   /** Signal for the issued-at date (from JWT 'iat' claim) */
//   issuedAt = computed(() =>
//     DateHelpers.fromSeconds(this.getClaimValue<number>(MyIdClaimNames.ISSUED_AT))
//   )
//   /** Signal for the expiry date (from JWT 'exp' claim) */
//   expiry = computed(() =>
//     DateHelpers.fromSeconds(this.getClaimValue<number>(MyIdClaimNames.EXPIRY))
//   )
//   /** Signal for the not-before date (from JWT 'nbf' claim) */
//   notBefore = computed(() =>
//     DateHelpers.fromSeconds(this.getClaimValue<number>(MyIdClaimNames.NOT_VALID_BEFORE))
//   )
//   /** Signal for the authentication time (from JWT 'auth_time' claim) */
//   authTime = computed(() =>
//     DateHelpers.fromSeconds(this.getClaimValue<number>(MyIdClaimNames.AUTH_TIME))
//   )

//   //- - - - - - - - - -//

//   /** Signal: true if running in Angular dev mode */
//   isInDevMode = signal(isDevMode())

//   //-------------------//

//   /**
//    * Store the JWT access token (must be implemented by subclass)
//    * @param accessToken The JWT access token string
//    */
//   protected abstract storeJwt(accessToken: string): void

//   /**
//    * Log an error with context (must be implemented by subclass)
//    * @param logData Error context and details
//    */
//   protected abstract logError(logData: LogErrorContext): void

//   //-------------------//

//   /**
//    * @param storedToken Used to populate the Signals (can be a string or a Promise)
//    */
//   constructor(storedToken?: (string | null | undefined) | Promise<string | null | undefined>) {
//     if (StringHelpers.isString(storedToken))
//       this._accessToken.set(storedToken ?? null)
//     else
//       storedToken?.then(tkn => this._accessToken.set(tkn ?? null))
//   }

//   //-------------------//

//   /**
//    * Log in with a new JWT access token
//    * @param accessToken The JWT access token string
//    */
//   logIn(accessToken: string): void {
//     devConsole.log('Logged in successfully with token:', accessToken);
//     this.storeJwt(accessToken)
//     this._accessToken.set(accessToken ?? null)
//   }

//   //-------------------//

//   /**
//    * Log out the current user, clearing the JWT and all claims
//    */
//   logOut(): void {
//     devConsole.log('Logged out successfully');
//     return this._accessToken.set(null);
//   }

//   //-------------------//

//   /**
//    * Checks if the current JWT is still valid (not expired)
//    * @returns True if the token is not expired, false otherwise
//    */
//   protected isTokenStillValid = (): boolean => {
//     const expiry = this.expiry();
//     return !!expiry && new Date() < expiry
//   }

//   //-------------------//

//   /**
//    * Checks if a claim type exists in the JWT
//    * @param claimType The claim type (key)
//    * @returns True if the claim exists
//    */
//   hasClaimType = (claimType: string): boolean =>
//     !!claimType && !!this.allClaimsRecord()[claimType]

//   //- - - - - - - - - -//

//   /**
//    * Checks if a claim has a specific value
//    * @param type The claim type (key)
//    * @param value The value to check
//    * @returns True if the claim exists and matches the value
//    */
//   hasClaim = (type: string, value: unknown): boolean =>
//     this.allClaimsRecord()?.[type]?.value == value

//   //- - - - - - - - - -//

//   /**
//    * Get a claim object by name
//    * @param claimName The claim name (key)
//    * @returns The Claim object, or null if not found
//    */
//   getClaim(claimName: string): Claim | null {
//     if (!claimName)
//       return null
//     return this.allClaimsRecord()[claimName]
//   }

//   //- - - - - - - - - -//

//   /**
//    * Get the value of a claim by name
//    * @param claimName The claim name (key)
//    * @returns The value of the claim, or undefined/null if not found
//    */
//   getClaimValue = <K extends keyof JWT>(claimName: K): JWT[K] | undefined =>
//     this.decodedToken()?.[claimName];

//   //-------------------//

//   /**
//    * Decode a JWT access token into its payload object
//    * @param accessToken The JWT access token string
//    * @returns The decoded token object, or null if invalid
//    */
//   private decodeToken(accessToken?: string | null): JWT | null {
//     try {

//       return accessToken
//         ? JwtHelper.decodeToken(accessToken) as JWT
//         : null;

//     } catch (error) {
//       console.log('decodeTokenError', error)
//       this.logError({
//         error,
//         method: 'decodeToken',
//         accessToken
//       });
//       return null
//     }
//   }

//   //-------------------//

//   /**
//    * Extract all claims from a parsed JWT token into a record of Claim objects
//    * @param parsedToken The decoded JWT token object
//    * @returns A record of claim keys to Claim objects
//    */
//   private extractAllClaimsRecord(parsedToken: any): Record<string, Claim> {
//     const claimsRecord: Record<string, Claim> = {}
//     if (!parsedToken)
//       return claimsRecord
//     for (const key in parsedToken)
//       claimsRecord[key] = Claim.Create(key, parsedToken[key])
//     return claimsRecord
//   }

//   //-------------------//

//   /**
//    * Checks if the current platform is the browser
//    * @returns True if running in the browser
//    */
//   protected isPlatformBrowser = () =>
//     isPlatformBrowser(this._platformId)

// } //Cls
