import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AccountIoService } from '@spider-baby/myid-io';
import { CookieSignInDto, CookieSignInResultData, FacebookSignInDto, GoogleSignInDto, JwtPackage, LoginDto, Verify2FactorCookieDto, Verify2FactorDto } from '@spider-baby/myid-io/models';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { MyIdAuthService } from '../auth/myid.auth.browser.service';
import { RefreshTokenService } from '@spider-baby/auth-signal/refresh';


@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private _auth = inject(MyIdAuthService);
  private _accIoService = inject(AccountIoService);
  private _refreshService = inject(RefreshTokenService);

  //-----------------//

  constructor() {
    this._refreshService.refresh$
      .pipe(
        switchMap(data => this.refreshJwt(data.refreshToken)),
        takeUntilDestroyed()
      )
      .subscribe({
        next: (jwt) => this.onLoginSuccessJwt(jwt),
        error: (error) => this.onLoginError(error)
      });
  }

  //-----------------//

  loginJwt(dto: LoginDto): Observable<JwtPackage> {

    return this._accIoService.login({ ...dto })
      .pipe(
        tap((jwt) => this.onLoginSuccessJwt(jwt)),
        catchError((error) => this.onLoginError(error))
      )

  }

  //-----------------//

  refreshJwt(refreshToken: string): Observable<JwtPackage> {
    return this._accIoService.loginRefresh({ refreshToken })
      .pipe(
        tap((jwt) => this.onLoginSuccessJwt(jwt)),
        catchError((error) => this.onLoginError(error))
      )
  }

  //-----------------//

  loginCookie(dto: CookieSignInDto): Observable<CookieSignInResultData> {

    return this._accIoService.cookieSignIn({ ...dto })
      .pipe(
        tap((ckData) => this.onLoginSuccessCookie(ckData)),
        catchError((error) => this.onLoginError(error))
      )

  }

  //-----------------//

  loginFacebookJwt(dto: FacebookSignInDto): Observable<JwtPackage> {

    return this._accIoService.faceBookLogin({ ...dto })
      .pipe(
        tap((jwt) => this.onLoginSuccessJwt(jwt)),
        catchError((error) => this.onLoginError(error))
      )

  }

  //- - - - - - - - -//
  
  loginFacebookCookie(dto: FacebookSignInDto): Observable<CookieSignInResultData> {
    
    return this._accIoService.faceBookCookieSignin({ ...dto })
    .pipe(
      tap((ckData) => this.onLoginSuccessCookie(ckData)),
      catchError((error) => this.onLoginError(error))
    )
    
  }
  
  //-----------------//

  loginGoogleJwt(dto: GoogleSignInDto): Observable<JwtPackage> {

    return this._accIoService.googleLogin({ ...dto })
      .pipe(
        tap((jwt) => this.onLoginSuccessJwt(jwt)),
        catchError((error) => this.onLoginError(error))
      )

  }

  //- - - - - - - - -//
  
  loginGoogleCookie(dto: GoogleSignInDto): Observable<CookieSignInResultData> {
    
    return this._accIoService.googleCookieSignin({ ...dto })
    .pipe(
      tap((ckData) => this.onLoginSuccessCookie(ckData)),
      catchError((error) => this.onLoginError(error))
    )
    
  }
  
  //-----------------//

  verify2Factor(dto: Verify2FactorDto): Observable<JwtPackage> {

    return this._accIoService.twoFactorVerification(dto)
      .pipe(
        tap((jwt) => this.onLoginSuccessJwt(jwt)),
        catchError((error) => this.onLoginError(error))
      )

  }

  //-----------------//

  verify2FactorCookie(dto: Verify2FactorCookieDto): Observable<JwtPackage> {

    return this._accIoService.twoFactorVerificationCookie(dto)
      .pipe(
        tap((ckData) => this.onLoginSuccessCookie(ckData)),
        catchError((error) => this.onLoginError(error))
      )

  }


  //-----------------//


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onLoginError(error: any) {
    this._auth.logOut();
    return throwError(() => error);
  }

  //- - - - - - - - -//

  private onLoginSuccessJwt(jwt: JwtPackage): Observable<JwtPackage> {

    if (jwt.accessToken)
      this._auth.logIn(jwt.accessToken);

    if (jwt.refreshToken && jwt.expiration) {
      this._refreshService.setRefreshState({
        refreshToken: jwt.refreshToken,
        expiration: jwt.expiration
      });
    }

    return of(jwt);
  }

  //- - - - - - - - -//

  private onLoginSuccessCookie(ckData: CookieSignInResultData): Observable<CookieSignInResultData> {
    return of(ckData);
  }

  //-----------------//

  logout = () => {
    this._auth.logOut();
    this._refreshService.clearRefreshState();
  };


} //Cls
