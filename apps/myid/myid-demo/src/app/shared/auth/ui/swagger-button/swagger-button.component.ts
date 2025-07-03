import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UrlUtils } from '@spider-baby/myid-io';
import { SbIconButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbTooltipDirective } from '@spider-baby/ui-kit/tooltip';
import { UiKitTheme } from '@spider-baby/ui-kit/types';
import { SbToastService } from '@spider-baby/ui-toast';
import { environment } from '../../../../../environments/environment';
import { AppSvgs } from '../../../../config/svgs';
import { MyIdAuthService } from '../../../id/auth/services/auth/myid-auth.browser.service';


@Component({
  selector: 'sb-swagger-button',
  standalone: true,
  imports: [
    SbIconButtonComponent,
    SbTooltipDirective,
    RouterModule
  ],
  template: `  
      <sb-icon-button         
          (click)="goToSwagger()"
          [svgString]="swaggerIconSvg()" 
          [sbTooltip]="showTooltip() ? 'Swagger' : ''"
          aria-label="Swagger"
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
export class SwaggerButtonComponent {

  private _authService = inject(MyIdAuthService);
  private _toast = inject(SbToastService);

  //- - - - - - - - - - -//

  swaggerPath = input('/swagger/index.html')
  color = input<UiKitTheme>('primary');
  showTooltip = input(true);
  swaggerIconSvg = input(AppSvgs.SWAGGER_ICON);

  private serverUrl = environment.serverBaseUrl;  
  
  //- - - - - - - - - - -//

  protected goToSwagger() {
    const token = this._authService.accessToken();
    if (!token)//there might be a cookie  so don't return
      this._toast.warning('You must be logged in to access Swagger')
    

    // const url = `${this.serverUrl}/${this.swaggerPath()}?tkn=${token}`;
    const url = UrlUtils.combine(this.serverUrl,`${this.swaggerPath()}?tkn=${token}`);
    window.open(url, '_blank', 'noopener,noreferrer');
  }


}
