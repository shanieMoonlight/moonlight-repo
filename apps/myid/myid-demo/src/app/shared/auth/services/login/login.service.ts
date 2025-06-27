import { inject, Injectable } from '@angular/core';
import { AccountIoService } from '@spider-baby/myid-io';
import { CookieSignInDto, CookieSignInResultData, GoogleSignInDto, JwtPackage, LoginDto, Verify2FactorCookieDto, Verify2FactorDto } from '@spider-baby/myid-io/models';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { MyIdAuthService } from '../auth/myid-auth.browser.service';
import { sampleJwt } from './secret';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private _auth = inject(MyIdAuthService);
  private _accIoService = inject(AccountIoService);

  //-----------------//

  loginJwt(dto: LoginDto): Observable<JwtPackage> {

    return this._accIoService.login({ ...dto })
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

  loginGoogleJwt(dto: GoogleSignInDto): Observable<JwtPackage> {

    return this._accIoService.googleLogin({ ...dto })
      .pipe(
        tap((jwt) => this.onLoginSuccessJwt(jwt)),
        catchError((error) => this.onLoginError(error))
      )

  }

  //-----------------//

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
      // this._auth.logIn(sampleJwt);
    return of(jwt);
  }

  //- - - - - - - - -//

  private onLoginSuccessCookie(ckData: CookieSignInResultData): Observable<CookieSignInResultData> {
    return of(ckData);
  }

  //-----------------//

  logout = () =>
    this._auth.logOut();


} //Cls
