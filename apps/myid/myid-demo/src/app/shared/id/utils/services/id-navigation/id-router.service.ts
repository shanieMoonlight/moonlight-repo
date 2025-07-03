import { forwardRef, inject, Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router, UrlCreationOptions, UrlTree } from '@angular/router';
import { MyIdRouteInfo } from '../../my-id-route-info';
import { q } from '@angular/cdk/overlay-module.d-B3qEQtts';

//#########################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//#########################################################//

@Injectable({
  providedIn: 'root',
  useClass: forwardRef(() => MyIdFallbackRouter),
})
export abstract class MyIdRouter {

  abstract url: string
  abstract createLoginUrlTree(redirectUrl?: string): UrlTree;
  abstract createChPwdUrlTree(): UrlTree;
  abstract createHomeUrlTree(): UrlTree;
  abstract createVerifyUrlTree(token?: string, provider?: string): UrlTree;

  abstract navigateByUrl(url: UrlTree): Promise<boolean>;
  abstract navigate(commands: string[], opts?: UrlCreationOptions): Promise<boolean>;


  navigateToLogin(redirectUrl?: string): Promise<boolean> {
    return this.navigateByUrl(this.createLoginUrlTree(redirectUrl));
  }
  navigateToChPwd(): Promise<boolean> {
    return this.navigateByUrl(this.createChPwdUrlTree());
  }
  navigateToHome(): Promise<boolean> {
    return this.navigateByUrl(this.createHomeUrlTree());
  }
  navigateToVerify(token?: string, provider?: string): Promise<boolean> {
    return this.navigateByUrl(this.createVerifyUrlTree(token, provider));
  }
}

//#########################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//#########################################################//

@Injectable()
export class MyIdFallbackRouter extends MyIdRouter {

  private _router = inject(Router);
  private _actRoute = inject(ActivatedRoute);

  url = this._router.url;


  override navigateByUrl(url: UrlTree): Promise<boolean> {
    return this._router.navigateByUrl(url);
  }

  //------------------//

  override createLoginUrlTree(redirectUrl?: string): UrlTree {
    const queryParams: Params = {};
    if (redirectUrl)
      queryParams[MyIdRouteInfo.Params.REDIRECT_URL_KEY] = redirectUrl;

    return this._router.createUrlTree(['../login'], {
      relativeTo: this._actRoute,
      queryParams
    });
  }

  //------------------//

  override createChPwdUrlTree(): UrlTree {
    return this._router.createUrlTree(['../change-pwd'], { relativeTo: this._actRoute });
  }

  //------------------//

  override createHomeUrlTree(): UrlTree {
    return this._router.createUrlTree(['/'], { relativeTo: this._actRoute });
  }

  //------------------//

  override createVerifyUrlTree(token?: string, provider?: string): UrlTree {
    const queryParams: Params = {};
    if (token)
      queryParams[MyIdRouteInfo.Params.TWO_FACTOR_TOKEN_KEY] = token;
    if (provider)
      queryParams[MyIdRouteInfo.Params.TWO_FACTOR_PROVIDER_KEY] = provider;
    return this._router.createUrlTree(['../verify-2-factor'], {
      relativeTo: this._actRoute,
      queryParams
    });
  }

  //-------------------//

  override navigate(commands: string[], opts?: UrlCreationOptions): Promise<boolean> {
    console.log('FallbackAccPagesRouter implements AAuthTeamsFeaturesRouter', 'navigate');
    return this._router.navigate(commands, opts);
  }
}

//###########################################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//###########################################################################//