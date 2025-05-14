import { BreakpointObserver } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, PLATFORM_ID, signal, TemplateRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';
import { ShareService } from '@spider-baby/utils-share';
import { map } from 'rxjs';
import { AppConstants } from '../../../../config/constants';
import { AppImages } from '../../../../config/images';
import { NavbarItem } from './@models/navbar-item';
import { MainNavbarLargeComponent } from './lrg/navbar-large.component';
import { MainNavbarSmlComponent } from './sml/navbar-small.component';

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
  standalone: true,
  imports: [
    MatEverythingModule,
    MainNavbarSmlComponent,
    MainNavbarLargeComponent,
    RouterModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {

  private _shareService = inject(ShareService)
  private _breakpoints = inject(BreakpointObserver)
  private platformId = inject(PLATFORM_ID);
  
  //- - - - - - - - - - - - - - -//
  
  _rhsOutletTemplate = input<TemplateRef<any> | undefined>(undefined, { alias: 'rhsOutletTemplate' })
  
  //- - - - - - - - - - - - - - -//
  
  
  protected _logoSml = signal(AppImages.Logo.small)
  
  public _randomId = computed(() => {
    const min = 1
    const max = 1000
    return Math.floor(Math.random() * (max - min + 1)) + min
  })
  
  
  
  protected _gitRepoUrl = signal(AppConstants.GIT_REP_URL)
  protected _npmPkgUrl = signal(AppConstants.NPM_PKG_URL)
  protected _rhsNavItems = signal<NavbarItem[]>(rhsNavbarItems)
  
  
  protected _isBrowser = signal(isPlatformBrowser(this.platformId));
  private _isSmallScreen$ = this._breakpoints.observe(['(max-width: 700px)'])
    .pipe(map((state => state.matches)))
  _isSmallScreen = toSignal(this._isSmallScreen$)

  //-----------------------------//

  protected share = () =>
    this._shareService.shareCurrentPage()

}//Cls
