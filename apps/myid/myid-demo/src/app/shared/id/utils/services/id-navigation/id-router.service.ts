import { forwardRef, inject, Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router, UrlCreationOptions } from '@angular/router';
import { devConsole } from '@spider-baby/dev-console';
import { MyIdRouteInfo } from '../../my-id-route-info';

//#########################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//#########################################################//

@Injectable({
  providedIn: 'root',
  useClass: forwardRef(() => MyIdFallbackRouter),
})
export abstract class MyIdRouter {
  abstract navigateToLogin(): Promise<boolean>;
  abstract navigateToChPwd(): Promise<boolean>;
  abstract navigateToChPwd(): Promise<boolean>;
  abstract navigateToHome(): Promise<boolean>;
  abstract navigateToVerify(token?: string, provider?: string): Promise<boolean>;
  abstract navigate(commands: string[], opts?: UrlCreationOptions): Promise<boolean>;
}

//#########################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//#########################################################//

@Injectable({
  providedIn: 'root',
})
export class MyIdFallbackRouter extends MyIdRouter {

  private _router = inject(Router);
  private _actRoute = inject(ActivatedRoute);

  //- - - - - - - - - //

  override navigateToLogin(): Promise<boolean> {
    devConsole.log(
      'MyIdFallbackRouter extends AMyIdRouter',
      'login'
    );
    return this._router.navigate([`../login`], { relativeTo: this._actRoute });
  }

  //------------------//

  override navigateToChPwd(): Promise<boolean> {
    devConsole.log(
      'MyIdFallbackRouter extends AMyIdRouter',
      'navigateToChPwd'
    );
    return this._router.navigate(['../change-pwd'], { relativeTo: this._actRoute });
  }

  //------------------//

  override navigateToVerify(token?: string, provider?: string): Promise<boolean> {
    devConsole.log(
      'MyIdFallbackRouter extends AMyIdRouter',
      'navigateToVerify'
    );
    const queryParams: Params = {}
    if (token)
      queryParams[MyIdRouteInfo.Params.TWO_FACTOR_TOKEN_KEY] = token
    if (provider)
      queryParams[MyIdRouteInfo.Params.TWO_FACTOR_PROVIDER_KEY] = provider
    return this._router.navigate(['../verify-2-factor'], {
      relativeTo: this._actRoute,
      queryParams
    })
  }

  //------------------//

  override navigateToHome(): Promise<boolean> {
    devConsole.log(
      'MyIdFallbackRouter extends AMyIdRouter',
      'navigateToHome'
    );
    return this._router.navigate(['/'], { relativeTo: this._actRoute })
  }

  //-------------------//

  navigate(commands: string[], opts?: UrlCreationOptions): Promise<boolean> {
    console.log(
      'FallbackAccPagesRouter implements AAuthTeamsFeaturesRouter',
      'navigate'
    );
    return this._router.navigate(commands, opts);
  }


}

//###########################################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//###########################################################################//