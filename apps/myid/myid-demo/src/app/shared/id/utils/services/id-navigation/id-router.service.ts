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
export abstract class AMyIdRouter {
  abstract navigateToLogin(): void;
  abstract navigateToChPwd(): void;
  abstract navigateToChPwd(): void;
  abstract navigateToHome(): void;
  abstract navigateToVerify(token?: string): void;
  abstract navigate(commands: string[], opts?: UrlCreationOptions): void;
}

//#########################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//#########################################################//

@Injectable({
  providedIn: 'root',
})
export class MyIdFallbackRouter extends AMyIdRouter {

  private _router = inject(Router);
  private _actRoute = inject(ActivatedRoute);

  //- - - - - - - - - //

  override navigateToLogin(): void {
    devConsole.log(
      'MyIdFallbackRouter extends AMyIdRouter',
      'login'
    );
    this._router.navigate([`../login`], { relativeTo: this._actRoute });
  }

  //------------------//

  override navigateToChPwd(): void {
    devConsole.log(
      'MyIdFallbackRouter extends AMyIdRouter',
      'navigateToChPwd'
    );
    this._router.navigate(['../change-pwd'], { relativeTo: this._actRoute });
  }

  //------------------//

  override navigateToVerify(token?: string): void {
    devConsole.log(
      'MyIdFallbackRouter extends AMyIdRouter',
      'navigateToVerify'
    );
    const queryParams: Params = {}
    if (token)
      queryParams[MyIdRouteInfo.Params.TWO_FACTOR_TOKEN] = token
    this._router.navigate(['../verify-2-factor'], {
      relativeTo: this._actRoute,
      queryParams
    })
  }

  //------------------//

  override navigateToHome(): void {
    devConsole.log(
      'MyIdFallbackRouter extends AMyIdRouter',
      'navigateToHome'
    );
    this._router.navigate(['/'], { relativeTo: this._actRoute })
  }

  //-------------------//

  navigate = (commands: string[], opts?: UrlCreationOptions) => {
    console.log(
      'FallbackAccPagesRouter implements AAuthTeamsFeaturesRouter',
      'navigate'
    );
    this._router.navigate(commands, opts);
  }


}

//###########################################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//###########################################################################//