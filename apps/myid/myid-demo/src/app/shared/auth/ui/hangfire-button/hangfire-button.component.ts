import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { SbToastService } from '@spider-baby/ui-toast';
import { AppSvgs } from '../../../../config/svgs';
import { MyIdRouteInfo } from '../../../id/utils/my-id-route-info';
import { SbIconButtonComponent } from '@spider-baby/ui-kit/buttons';
import { IdTheme } from '../../../ui/theme.type';
import { SbTooltipDirective } from '@spider-baby/ui-kit/tooltip';
import { MyIdAuthService } from '../../services/auth/myid-auth.browser.service';

@Component({
  selector: 'sb-hangfire-button',
  imports: [
    SbIconButtonComponent,
    SbTooltipDirective
  ],
  template: `
      <sb-icon-button         
          (click)="goToSwagger()"       
            [svgString]="hangfireIconSvg()" 
            [sbTooltip]="showTooltip() ? 'Hangfire' : ''"
            aria-label="Hangfire"
            [color]="color()" />
  `,
  styles: [`
    :host{
      display: inline-block;        
      width: 40px;
      height: 40px;
    }
    a{
      height: 100%;
      width: 100%;
    }    
    sb-icon-button{
      height: 100%;
      width: 100%;
    }
    `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HangfireButtonComponent {

  private _authService = inject(MyIdAuthService);
  private _toast = inject(SbToastService);

  //- - - - - - - - - - -//

  hangfirePath = input('/myid-hangfire')
  color = input<IdTheme>('primary');
  showTooltip = input(true);
  hangfireIconSvg = input(AppSvgs.HANGFIRE_ICON);

  protected _hangfireUrlWithParams = computed(() => `${this.hangfirePath()}?${MyIdRouteInfo.Params.HANGFIRE_TOKEN_KEY}=${this._authService.accessToken()}`)
  
  //- - - - - - - - - - -//

  protected goToSwagger() {
    const token = this._authService.accessToken();
    if (!token)//there might be a cookie  so don't return
      this._toast.warning('You must be logged in to access Swagger')
    

    const url = `${this.hangfirePath()}?tkn=${token}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }


}
