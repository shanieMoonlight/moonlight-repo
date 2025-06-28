import { inject, Injectable } from '@angular/core';
import { AppRouteDefs } from '../../../../app-route-defs';
import { AMyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';
import { Params, Router, UrlCreationOptions } from '@angular/router';
import { MyIdRouteInfo } from '../../../../shared/id/utils/my-id-route-info';

@Injectable({
  providedIn: 'root'
})
export class MyIdMainRouterService extends AMyIdRouter {

  private _router = inject(Router);

  //- - - - - - - - - - - - - //

  override navigateToChPwd(): void {
    this._router.navigate([AppRouteDefs.fullPathsWithSlash.main.route('change-pwd')]);
  }

  override navigateToHome(): void {
    this._router.navigate([AppRouteDefs.fullPathsWithSlash.main.route('home')]);
  }

  override navigateToLogin() {
    this._router.navigate([AppRouteDefs.fullPathsWithSlash.main.route('login-jwt')]);
  }

  override  navigateToVerify(token?: string, provider?:string): void {
    const queryParams: Params = {}

    if (token)
      queryParams[MyIdRouteInfo.Params.TWO_FACTOR_TOKEN_KEY] = token
    if (provider)
      queryParams[MyIdRouteInfo.Params.TWO_FACTOR_PROVIDER_KEY] = provider

    this._router.navigate(
      [AppRouteDefs.fullPathsWithSlash.main.route('verify-2-factor')],
      // [AppRouteDefs.fullPathsWithSlash.main.route('verify-2-factor-cookie')],
      { queryParams }
    );
  }

  override navigate(commands: string[], opts?: UrlCreationOptions): void {
    this._router.navigate(commands, opts);
  }
}