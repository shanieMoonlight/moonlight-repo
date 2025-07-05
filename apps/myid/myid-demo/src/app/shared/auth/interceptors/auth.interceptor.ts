import { HttpContext, HttpContextToken, HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Params, Router } from '@angular/router';
import { devConsole } from '@spider-baby/dev-console';
import { SbToastService, ToastData } from '@spider-baby/ui-toast';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppRouteDefs } from '../../../app-route-defs';
import { MyIdRouteInfo } from '../../id/utils/my-id-route-info';
import { LoginService } from '@spider-baby/myid-auth/services';

//########################################//

export const BYPASS_AUTH_INTERCEPTOR_CTX_TKN = new HttpContextToken<boolean>(() => false);
export const BYPASS_AUTH_INTERCEPTOR_OPTION = {
  context: new HttpContext().set(BYPASS_AUTH_INTERCEPTOR_CTX_TKN, true)
}

//########################################//

export const myIdDemoAuthInterceptorFn: HttpInterceptorFn = (req, next) => {

  const loginService = inject(LoginService);
  const router = inject(Router)
  const toast = inject(SbToastService)

  if (req.context.get(BYPASS_AUTH_INTERCEPTOR_CTX_TKN))
    return next(req)

  return next(req).pipe(
    catchError((errorResponse: HttpErrorResponse) => {

      if (!isAuthError(errorResponse.status))
        return throwError(() => errorResponse)

      // Ignore auth errors on allow-anonymous pages
      if (isOnAllowAnonymousPage(router.url))
        return throwError(() => errorResponse); // propagate error for UI feedback

      handleUnauthorized(req, errorResponse, loginService, router, toast)
      return throwError(() => errorResponse)
    })
  )
};

//----------------------------------------//

const isAuthError = (status: number): boolean =>
  status === HttpStatusCode.Unauthorized || status === HttpStatusCode.Forbidden;

//----------------------------------------//

function handleUnauthorized(
  req: HttpRequest<unknown>,
  errorResponse: HttpErrorResponse,
  loginService: LoginService,
  router: Router,
  toast: SbToastService) {


  if (errorResponse.status === HttpStatusCode.Unauthorized) {
    devConsole.log(errorResponse);

    toast.show(ToastData.Warning('You must be logged in to access this page.'), 5000)
    loginService.logout(); //Log out Unauthorized only
  } else {
    toast.show(ToastData.Warning('You do not have the correct permissions to access this page.'), 5000)
  }

  const queryParams = getRedirectQueryParams(router.url);
  console.log('Redirecting to login with query params:', queryParams);
  

  router.navigate(
    [AppRouteDefs.fullPaths.main.account.route('login-jwt')],
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
    AppRouteDefs.fullPaths.main.account.route('login-jwt'),
    AppRouteDefs.fullPaths.main.account.route('login-cookie'),
    AppRouteDefs.fullPaths.main.account.route('confirm-email'),
    AppRouteDefs.fullPaths.main.account.route('confirm-email-with-password'),
    AppRouteDefs.fullPaths.main.account.route('reset-password'),
    AppRouteDefs.fullPaths.main.account.route('verify-2-factor'),
    AppRouteDefs.fullPaths.main.account.route('verify-2-factor-cookie')
  ]

  if (!routesToIgnore?.length)
    return false

  for (const route of routesToIgnore) {
    if (url.includes(route))
      return true
  }

  return false
}
