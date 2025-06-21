import { inject, Injectable } from '@angular/core';
import { AppRouteDefs } from '../../../../app-route-defs';
import { AMyIdRouter } from '../../../../shared/id/utils/services/id-navigation/id-router.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MyIdMainRouterService extends AMyIdRouter  {

  private _router = inject(Router);

  //- - - - - - - - - - - - - //

  navigateToChPwd(): void {
    this._router.navigate([AppRouteDefs.fullPathsWithSlash.main.route('change-pwd')]);
  }

  navigateToHome(): void {
    this._router.navigate([AppRouteDefs.fullPathsWithSlash.main.route('home')]);
  }

  navigateToLogin() {
    this._router.navigate([AppRouteDefs.fullPathsWithSlash.main.route('login-jwt')]);
  }

}