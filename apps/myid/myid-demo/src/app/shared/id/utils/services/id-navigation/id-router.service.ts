import { forwardRef, inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { devConsole } from '@spider-baby/dev-console';

//###########################################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//###########################################################################//

@Injectable({
  providedIn: 'root',
  useClass: forwardRef(() => MyIdFallbackRouter),
})
export abstract class AMyIdRouter {
  abstract navigateToLogin(): void;
  abstract navigateToChPwd(): void;
  abstract navigateToHome(): void;
}

//###########################################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//###########################################################################//

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

 override navigateToChPwd () :void {
    devConsole.log(
      'MyIdFallbackRouter extends AMyIdRouter',
      'navigateToChPwd'
    );
    this._router.navigate(['../ch-pwd'], { relativeTo: this._actRoute });
  }

  //------------------//

  override navigateToHome () :void{
    devConsole.log(
      'MyIdFallbackRouter extends AMyIdRouter',
      'navigateToHome'
    );
    this._router.navigate(['/'], { relativeTo: this._actRoute })
  }
  

}

//###########################################################################//
//# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #//
//###########################################################################//