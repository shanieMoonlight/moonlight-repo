import { inject, Injectable } from '@angular/core';
import { AppRouteDefs } from '../../../../app-route-defs';
import { MyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';
import { Params, Router, UrlCreationOptions, UrlTree } from '@angular/router';
import { MyIdRouteInfo } from '../../../../shared/id/utils/my-id-route-info';

@Injectable({
  providedIn: 'root'
})
export class MyIdMainRouterService extends MyIdRouter {
  private _router = inject(Router);

  
  url = this._router.url;

  override navigateByUrl(url: UrlTree): Promise<boolean> {
    return this._router.navigateByUrl(url);
  }

  override createLoginUrlTree(redirectUrl?: string): UrlTree {
    const queryParams: Params = {};
    if (redirectUrl)
      queryParams[MyIdRouteInfo.Params.REDIRECT_URL_KEY] = redirectUrl;
    return this._router.createUrlTree([AppRouteDefs.fullPathsWithSlash.main.account.route('login-jwt')],
      { queryParams });
  }

  override createChPwdUrlTree(): UrlTree {
    return this._router.createUrlTree([AppRouteDefs.fullPathsWithSlash.main.account.route('change-password')]);
  }

  override createHomeUrlTree(): UrlTree {
    return this._router.createUrlTree([AppRouteDefs.fullPathsWithSlash.main.route('home')]);
  }

  override createVerifyUrlTree(token?: string, provider?: string): UrlTree {
    const queryParams: Params = {};
    if (token)
      queryParams[MyIdRouteInfo.Params.TWO_FACTOR_TOKEN_KEY] = token;
    if (provider)
      queryParams[MyIdRouteInfo.Params.TWO_FACTOR_PROVIDER_KEY] = provider;
    return this._router.createUrlTree([
      AppRouteDefs.fullPathsWithSlash.main.account.route('verify-2-factor')
    ], { queryParams });
  }

  override navigate(commands: string[], opts?: UrlCreationOptions): Promise<boolean> {
    return this._router.navigate(commands, opts);
  }
}