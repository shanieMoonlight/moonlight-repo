import { HttpContext, HttpContextToken, HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Params, Router } from '@angular/router';
import { AppRouteDefs } from '../../../app-route-defs';
import { MyIdRouteInfo } from '../../id/utils/my-id-route-info';
import { EMPTY, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from '../services/login/login.service';

//########################################//

export const BYPASS_AUTH_INTERCEPTOR_CTX_TKN = new HttpContextToken<boolean>(() => false);
export const BYPASS_AUTH_INTERCEPTOR_OPTION = {
  context: new HttpContext().set(BYPASS_AUTH_INTERCEPTOR_CTX_TKN, true)
}

//########################################//

export const myIdDemoAuthInterceptorFn: HttpInterceptorFn = (req, next) => {

  const loginService = inject(LoginService);
  const router = inject(Router)

  if (req.context.get(BYPASS_AUTH_INTERCEPTOR_CTX_TKN))
    return next(req)

  return next(req).pipe(
    catchError((errorResponse: HttpErrorResponse) => {

      if (!isAuthError(errorResponse.status))
        return throwError(() => errorResponse)
      
      // Ignore auth errors on allow-anonymous pages
      if (isOnAllowAnonymousPage(router.url))
        return EMPTY;

      handleUnauthorized(req, errorResponse, loginService, router)
      return throwError(() => errorResponse)
    })
  )
};

//----------------------------------------//

const isAuthError = (status: number): boolean =>
  status === HttpStatusCode.Unauthorized || status === HttpStatusCode.Forbidden;

//----------------------------------------//

function handleUnauthorized(req: HttpRequest<unknown>, errorResponse: HttpErrorResponse, loginService: LoginService, router: Router) {

  console.log('handleUnauthorized', errorResponse);

  if (errorResponse.status === HttpStatusCode.Unauthorized) {
    console.log(errorResponse);

    console.log('Unauthorized', 'You must be logged in to access this page.');
    loginService.logout(); //Log out Unauthorized only
  } else {
    console.log('Forbidden', 'You do not have the correct permissions to access this page.');
  }

  const queryParams = getRedirectQueryParams(router.url);

  router.navigate(
    [AppRouteDefs.fullPaths.main.route('login-jwt')],
    { queryParams: queryParams }
  )

}

//----------------------------------------//

function getRedirectQueryParams(url: string): Params {
  return { [MyIdRouteInfo.Params.REDIRECT_URL_KEY]: url };
}
//-------------------------------------------------//

//Background tasks can cause auth errors. W want to ignore them if the user is authorizing.
function isOnAllowAnonymousPage(url: string) {

  const routesToIgnore: string[] = [
    AppRouteDefs.fullPaths.main.route('login-jwt'),
    AppRouteDefs.fullPaths.main.route('login-cookie'),
    AppRouteDefs.fullPaths.main.route('confirm-email'),
    AppRouteDefs.fullPaths.main.route('confirm-email-with-password'),
    AppRouteDefs.fullPaths.main.route('reset-password'),
    AppRouteDefs.fullPaths.main.route('verify-2-factor'),
    AppRouteDefs.fullPaths.main.route('verify-2-factor-cookie')
  ]


  console.log('routesToIgnore', routesToIgnore);


  if (!routesToIgnore?.length)
    return false

  for (const route of routesToIgnore) {
    if (url.includes(route))
      return true
  }

  return false
}
