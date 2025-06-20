import { inject, Injectable } from '@angular/core';
import { AppRouteDefs } from '../../../../../app-route-defs';
import { Router } from 'express';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class IdNavigationService {

  private _router = inject(Router);

  //- - - - - - - - - - - - - //


  navigateToLogin() {
    this._router.navigate([AppRouteDefs.fullPathsWithSlash.main.route('login-jwt')]);
  }

}
