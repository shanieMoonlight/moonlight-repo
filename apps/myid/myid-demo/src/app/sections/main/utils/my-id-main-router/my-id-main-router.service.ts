import { inject, Injectable } from '@angular/core';
import { AppRouteDefs } from '../../../../app-route-defs';
import { MyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';
import { Params, Router, UrlCreationOptions } from '@angular/router';
import { MyIdRouteInfo } from '../../../../shared/id/utils/my-id-route-info';

@Injectable({
  providedIn: 'root'
})
export class MyIdMainRouterService extends MyIdRouter {

  private _router = inject(Router);

  //- - - - - - - - - - - - - //

  override navigateToChPwd() {
    return this._router.navigate([AppRouteDefs.fullPathsWithSlash.main.route('change-pwd')]);
  }

  override navigateToHome() {
    return this._router.navigate([AppRouteDefs.fullPathsWithSlash.main.route('home')]);
  }

  override navigateToLogin() {
    return this._router.navigate([AppRouteDefs.fullPathsWithSlash.main.route('login-jwt')]);
  }

  override  navigateToVerify(token?: string, provider?: string) {
    const queryParams: Params = {}

    if (token)
      queryParams[MyIdRouteInfo.Params.TWO_FACTOR_TOKEN_KEY] = token
    if (provider)
      queryParams[MyIdRouteInfo.Params.TWO_FACTOR_PROVIDER_KEY] = provider

    return this._router.navigate(
      [AppRouteDefs.fullPathsWithSlash.main.route('verify-2-factor')],
      // [AppRouteDefs.fullPathsWithSlash.main.route('verify-2-factor-cookie')],
      { queryParams }
    );
  }

  override navigate(commands: string[], opts?: UrlCreationOptions) {
    return this._router.navigate(commands, opts);
  }
}