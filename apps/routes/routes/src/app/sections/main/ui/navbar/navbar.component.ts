import { BreakpointObserver } from '@angular/cdk/layout';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, TemplateRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { MatEverythingModule } from '@spider-baby/utils-mat-everything';
import { NavigateNewWindowDirective } from '@spider-baby/utils-open-in-new-window';
import { ShareService } from '@spider-baby/utils-share';
import { map } from 'rxjs';
import { AppConstants } from '../../../../config/constants';
import { AppImages } from '../../../../config/images';
import { MainNavRoutes } from './navbar-items';
import { AppRouteDefs } from '../../../../app-route-defs';
@Component({
  selector: 'rd-main-navbar',
  standalone: true,
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
export class MainNavbarComponent {
  private _shareService = inject(ShareService);
  private _breakpoints = inject(BreakpointObserver);

  //- - - - - - - - - - - - - - -//

  _rhsOutletTemplate = input<TemplateRef<any> | undefined>(undefined, { alias: 'rhsOutletTemplate', });

  //- - - - - - - - - - - - - - -//

  protected _logoSml = AppImages.Logo.small

  protected _gitRepoUrl = AppConstants.GIT_REP_URL
  protected _npmPkgUrl = AppConstants.NPM_PKG_URL
  protected _rhsNavItems = MainNavRoutes

  isSmallScreen$ = this._breakpoints
    .observe(['(max-width: 850px)'])
    .pipe(map((state) => state.matches));
  isSmallScreen = toSignal(this.isSmallScreen$);

  protected _adminRoute = '/' + AppRouteDefs.fullPaths.admin.route();


  //-----------------------------//

  protected share = () => this._shareService.shareCurrentPage();
} //Cls
