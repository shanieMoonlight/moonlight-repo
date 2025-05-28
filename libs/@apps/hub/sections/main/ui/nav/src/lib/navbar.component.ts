import { BreakpointObserver } from '@angular/cdk/layout';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, PLATFORM_ID, signal, TemplateRef, } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { HubAppConstants } from "@sb-hub/core-config/constants";
import { HubAppImages } from "@sb-hub/core-config/images";
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { SbNavigateNewWindowDirective } from '@spider-baby/utils-open-in-new-window';
import { ShareService } from '@spider-baby/utils-share';
import { map } from 'rxjs';

//##############################################################//

interface NavbarItem {
  routerLink: string;
  tooltip: string;
  icon: string;
  text: string;
}

//##############################################################//

const rhsNavbarItems: NavbarItem[] = [
  // {
  //   routerLink: 'route1',
  //   tooltip: 'Route 1',
  //   icon: 'egg',
  //   text: 'Route 1',
  // },
  // {
  //   routerLink: 'route2',
  //   tooltip: 'Route 2',
  //   icon: 'join_inner',
  //   text: 'Route 2',
  // },
  // {
  //   routerLink: 'route3',
  //   tooltip: 'Route 3',
  //   icon: 'oil_barrel',
  //   text: 'Route 3',
  // },
  // {
  //   routerLink: '/api',
  //   tooltip: 'Api Documentation',
  //   icon: 'api',
  //   text: 'Api',
  // },
];

//##############################################################//

@Component({
  selector: 'hub-main-navbar',
  standalone: true,
  imports: [
    MatEverythingModule,
    SbNavigateNewWindowDirective,
    NgTemplateOutlet,
    RouterModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubMainNavbarComponent {
  private _shareService = inject(ShareService);
  private _breakpoints = inject(BreakpointObserver);
  private platformId = inject(PLATFORM_ID);

  //- - - - - - - - - - - - - - -//

  _rhsOutletTemplate = input<TemplateRef<any> | undefined>(undefined, {
    alias: 'rhsOutletTemplate',
  });

  _title = input<string>('SpiderBaby', { alias: 'title' });

  //- - - - - - - - - - - - - - -//

  protected _logoSml = signal(HubAppImages.Logo.small);

  protected _gitRepoUrl = signal(HubAppConstants.GIT_REP_URL);
  protected _npmPkgUrl = signal(HubAppConstants.NPM_PACKAGES);
  protected _rhsNavItems = signal<NavbarItem[]>(rhsNavbarItems);

  protected _isBrowser = signal(isPlatformBrowser(this.platformId));
  isSmallScreen$ = this._breakpoints
    .observe(['(max-width: 650px)'])
    .pipe(map((state) => state.matches));
    protected _isSmallScreen = toSignal(this.isSmallScreen$);

  //-----------------------------//

  protected share = () => this._shareService.shareCurrentPage()

} //Cls
