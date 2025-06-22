import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { CookieSignInDto, CookieSignInResultData, GoogleSignInDto, JwtPackage, LoginDto, Verify2FactorDto } from '../../../../io/models';
import { AccountIoService } from '../../../../io/services';
import { AuthTeamsService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  private _auth = inject(AuthTeamsService);
  private _accIoService = inject(AccountIoService);

  //-----------------//

  // isLoggedIn = computed(() => this._auth.isLoggedIn$())

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
console.log('verify2Factor dto, ', dto);

    return this._accIoService.twoFactorVerification(dto)
      .pipe(
        tap((jwt) => this.onLoginSuccessJwt(jwt)),
        catchError((error) => this.onLoginError(error))
      )

  }

  //-----------------//

  private onLoginError(error: any) {
    this._auth.logOut();
    return throwError(() => error);
  }

  //- - - - - - - - -//

  private onLoginSuccessJwt(jwt: JwtPackage): Observable<JwtPackage> {
    console.log('login jwt, ', jwt)
    if (jwt.accessToken)
      this._auth.logIn(jwt.accessToken);
    return of(jwt);
  }

  //- - - - - - - - -//

  private onLoginSuccessCookie(ckData: CookieSignInResultData): Observable<CookieSignInResultData> {
    console.log('login cookie, ', ckData)
    return of(ckData);
  }

  //-----------------//

  // logout = () => this._auth.logOut()


} //Cls
