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
    routerLink: 'oauth',
    tooltip: 'Oauth',
    icon: 'verified_user',
    text: 'Oauth'
  },
  // {
  //   routerLink: 'route2',
  //   tooltip: 'Route 2',
  //   icon: 'join_inner',
  //   text: 'Route 2'
  // },
  // {
  //   routerLink: 'route3',
  //   tooltip: 'Route 3',
  //   icon: 'oil_barrel',
  //   text: 'Route 3'
  // },
  {
    routerLink: '/api',
    tooltip: 'Api Documentation',
    icon: 'api',
    text: 'Api'
  },
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
    SbTooltipDirective
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainNavbarComponent {

  private _shareService = inject(ShareService)
  private _breakpoints = inject(BreakpointObserver)

  //- - - - - - - - - - - - - - -//

  _rhsOutletTemplate = input<TemplateRef<any> | undefined>(undefined, { alias: 'rhsOutletTemplate' })

  //- - - - - - - - - - - - - - -//


  protected _logoSml = signal(AppImages.Logo.small) 
  

  protected _gitRepoUrl = signal(AppConstants.GIT_REP_URL)
  protected _npmPkgUrl = signal(AppConstants.NPM_PKG_URL)
  protected _rhsNavItems = signal<NavbarItem[]>(rhsNavbarItems)


  isSmallScreen$ = this._breakpoints.observe(['(max-width: 650px)'])
    .pipe(map((state => state.matches)))
  isSmallScreen = toSignal(this.isSmallScreen$)

  //-----------------------------//

  protected share = () =>
    this._shareService.shareCurrentPage()

}//Cls
