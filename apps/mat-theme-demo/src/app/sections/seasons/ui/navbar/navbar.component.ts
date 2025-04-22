import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal, TemplateRef } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatEverythingModule } from '@moonlight/material/theming/utils';
import { AppConstants } from '../../../../config/constants';
import { NavigateNewWindowDirective } from '@moonlight/utils/open-in-new-window';
import { ShareService } from '@moonlight/utils/share';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, LayoutModule } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

//##################################################//
// 
@Component({
  selector: 'ml-navbar',
  imports: [
    MatEverythingModule,
    NgTemplateOutlet,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeasonalNavbarComponent {

  private _shareService = inject(ShareService)
  private _breakpoints = inject(BreakpointObserver)

  //- - - - - - - - - - - - - - -//

  _rhsOutletTemplate = input<TemplateRef<any> | undefined>(undefined, { alias: 'rhsOutletTemplate' })

  //- - - - - - - - - - - - - - -//

  protected _gitRepoUrl = signal(AppConstants.GIT_REPO)
  protected _npmPkgUrl = signal(AppConstants.NPM_PKG)


  isSmallScreen$ = this._breakpoints.observe(['(max-width: 650px)'])
    .pipe(map((state => state.matches)))
  isSmallScreen = toSignal(this.isSmallScreen$)

  //-----------------------------//

  protected share = () =>
    this._shareService.shareCurrentPage()

}//Cls
