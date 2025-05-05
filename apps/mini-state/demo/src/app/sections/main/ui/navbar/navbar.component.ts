import { BreakpointObserver } from '@angular/cdk/layout';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal, TemplateRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { NavigateNewWindowDirective } from '@spider-baby/utils-open-in-new-window';
import { ShareService } from '@spider-baby/utils-share';
import { map } from 'rxjs';
import { AppConstants } from '../../../../config/constants';
import { AppImages } from '../../../../config/images';

//##############################################################//

interface NavbarItem {
  routerLink: string,
  tooltip: string,
  iconName: string,
  text: string
}

//##############################################################//


const rhsNavbarItems: NavbarItem[] = [
  {
    routerLink: 'simple',
    tooltip: 'Simple',
    iconName: 'egg',
    text: 'Simple'
  },
  {
    routerLink: 'combined',
    tooltip: 'Combined',
    iconName: 'join_inner',
    text: 'Combined'
  },
  {
    routerLink: 'crud',
    tooltip: 'Crud',
    iconName: 'oil_barrel',
    text: 'Crud'
  },
  {
    routerLink: 'search',
    tooltip: 'Search',
    iconName: 'search',
    text: 'Search'
  },
  {
    routerLink: '/api',
    tooltip: 'Api Documentation',
    iconName: 'api',
    text: 'Api'
  },
]

//##############################################################//


@Component({
  selector: 'sb-navbar',
  imports: [
    MatEverythingModule,
    NavigateNewWindowDirective,
    NgTemplateOutlet,
    RouterModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {

  private _shareService = inject(ShareService)
  private _breakpoints = inject(BreakpointObserver)

  //- - - - - - - - - - - - - - -//

  _rhsOutletTemplate = input<TemplateRef<any> | undefined>(undefined, { alias: 'rhsOutletTemplate' })

  //- - - - - - - - - - - - - - -//


  protected _logoSml = signal(AppImages.Logo.small) 
  
  public get _randomId(): number {
    const min = 1
    const max = 1000
    return Math.floor(Math.random() * (max - min + 1)) + min
  }



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
