import { BreakpointObserver } from '@angular/cdk/layout';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal, TemplateRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { SbNavigateNewWindowDirective } from '@spider-baby/utils-open-in-new-window';
import { ShareService } from '@spider-baby/utils-share';
import { map } from 'rxjs';
import { AppConstants } from '../../../../config/constants';
import { AppImages } from '../../../../config/images';
import { SbTooltipDirective } from '../../../../shared/ui/tooltip/tooltip.directive';
import { AppRouteDefs } from '../../../../app-route-defs';
import { GithubCornerComponent } from '../../../../shared/ui/corner-link/git-corner.component';
import { SbIconButtonComponent } from '../../../../shared/ui/buttons/icon-button/icon-button.component';
import { AppSvgs } from '../../../../config/svgs';

//##############################################################//

interface NavbarItem {
  routerLink: string,
  tooltip: string,
  icon: string,
  text: string
}

//##############################################################//


const rhsNavbarItems: NavbarItem[] = [
  {
    routerLink: AppRouteDefs.routes.main.route('scratchpad'),
    tooltip: 'Scratchpad',
    icon: 'draw',
    text: 'ScratchPad'
  },
  // {
  //   routerLink: '/api',
  //   tooltip: 'Api Documentation',
  //   icon: 'api',
  //   text: 'Api'
  // },
]

//##############################################################//


@Component({
  selector: 'sb-main-navbar',
  standalone: true,
  imports: [
    MatEverythingModule,
    SbNavigateNewWindowDirective,
    NgTemplateOutlet,
    RouterModule,
    SbTooltipDirective,
    GithubCornerComponent,
    SbIconButtonComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainNavbarComponent {

  private _shareService = inject(ShareService)
  private _breakpoints = inject(BreakpointObserver)

  //- - - - - - - - - - - - - - -//

  _lhsOutletTemplate = input<TemplateRef<unknown> | undefined>(undefined, { alias: 'lhsOutletTemplate' })
  _rhsOutletTemplate = input<TemplateRef<unknown> | undefined>(undefined, { alias: 'rhsOutletTemplate' })

  //- - - - - - - - - - - - - - -//


  protected _logoSml = signal(AppImages.Logo.small) 
  

  protected _gitRepoUrl = AppConstants.GIT_REP_URL
  protected _npmPkgUrl = AppConstants.NPM_PKG_URL
  protected _rhsNavItems = signal<NavbarItem[]>(rhsNavbarItems)

  protected _npmSvg = AppSvgs.NPM_ICON
  protected _gitSvg = AppSvgs.GIT_ICON
  protected _shareSvg = AppSvgs.SHARE_ICON



  isSmallScreen$ = this._breakpoints.observe(['(max-width: 650px)'])
    .pipe(map((state => state.matches)))
  isSmallScreen = toSignal(this.isSmallScreen$)

  //-----------------------------//

  protected share = () =>
    this._shareService.shareCurrentPage()

}//Cls
