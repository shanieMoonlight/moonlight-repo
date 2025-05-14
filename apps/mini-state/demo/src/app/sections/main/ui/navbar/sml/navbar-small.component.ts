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
  selector: 'sb-main-navbar-sml',
  imports: [
    MatEverythingModule,
    NavigateNewWindowDirective,
    NgTemplateOutlet,
    RouterModule
  ],
  templateUrl: './navbar-small.component.html',
  styleUrl: './navbar-small.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainNavbarSmlComponent {

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

  // Signal to track menu state
  protected _menuOpen = signal(false)

  isSmallScreen$ = this._breakpoints.observe(['(max-width: 650px)'])
    .pipe(
      map((state => state.matches))
    )
  isSmallScreen = toSignal(this.isSmallScreen$)

  //-----------------------------//

  protected share = () =>
    this._shareService.shareCurrentPage()

  protected toggleMenu = () =>
    this._menuOpen.update(current => !current);

  protected openMenu = () =>
    this._menuOpen.set(true);

  protected closeMenu = () =>
    {
console.log('closeMenu');

this._menuOpen.set(false);
console.log('closeMenu', this._menuOpen());
    };


}//Cls


