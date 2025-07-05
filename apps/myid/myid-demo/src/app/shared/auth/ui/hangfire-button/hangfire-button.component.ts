import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MyIdAuthService } from '@spider-baby/myid-auth/services';
import { UrlUtils } from '@spider-baby/myid-io';
import { SbIconButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbTooltipDirective } from '@spider-baby/ui-kit/tooltip';
import { UiKitTheme } from '@spider-baby/ui-kit/types';
import { SbToastService } from '@spider-baby/ui-toast';
import { environment } from '../../../../../environments/environment';
import { AppSvgs } from '../../../../config/svgs';

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
  color = input<UiKitTheme>('primary');
  showTooltip = input(true);
  hangfireIconSvg = input(AppSvgs.HANGFIRE_ICON);

  private serverUrl = environment.serverBaseUrl;  
  
  //- - - - - - - - - - -//

  protected goToSwagger() {
    const token = this._authService.accessToken();
    if (!token)//there might be a cookie  so don't return
      this._toast.warning('You must be logged in to access Swagger')
    

    const url = UrlUtils.combine(this.serverUrl,`${this.hangfirePath()}?tkn=${token}`);
    window.open(url, '_blank', 'noopener,noreferrer');
  }


}
