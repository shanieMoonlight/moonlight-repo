import { BreakpointObserver } from '@angular/cdk/layout';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal, TemplateRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { NavigateNewWindowDirective } from '@spider-baby/utils-open-in-new-window';
import { ShareService } from '@spider-baby/utils-share';
import { map } from 'rxjs';
import { AppConstants } from '../../../../../config/constants';
import { AppImages } from '../../../../../config/images';
import { NavbarItem } from '../@models/navbar-item';

@Component({
  selector: 'sb-main-navbar-lrg',
  imports: [
    MatEverythingModule,
    NavigateNewWindowDirective,
    NgTemplateOutlet,
    RouterModule
  ],
  templateUrl: './navbar-large.component.html',
  styleUrl: './navbar-large.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainNavbarLargeComponent {

  private _shareService = inject(ShareService)
  private _breakpoints = inject(BreakpointObserver)

  //- - - - - - - - - - - - - - -//

  _rhsOutletTemplate = input<TemplateRef<any> | undefined>(undefined, { alias: 'rhsOutletTemplate' })
  _rhsNavItems = input<NavbarItem[]>([], { alias: 'rhsNavItems' })
  _randomId = input<number>(666, { alias: 'randomId' })

  //- - - - - - - - - - - - - - -//


  protected _logoSml = signal(AppImages.Logo.small)



  protected _gitRepoUrl = signal(AppConstants.GIT_REP_URL)
  protected _npmPkgUrl = signal(AppConstants.NPM_PKG_URL)


  isSmallScreen$ = this._breakpoints.observe(['(max-width: 900px)'])
    .pipe(map((state => state.matches)))
  isSmallScreen = toSignal(this.isSmallScreen$)

  //-----------------------------//

  protected share = () =>
    this._shareService.shareCurrentPage()

}//Cls

