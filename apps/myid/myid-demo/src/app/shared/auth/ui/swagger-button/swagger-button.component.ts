import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SbToastService } from '@spider-baby/ui-toast';
import { AppSvgs } from '../../../../config/svgs';
import { SbIconButtonComponent } from '@spider-baby/ui-kit/buttons';
import { IdTheme } from '../../../ui/theme.type';
import { SbTooltipDirective } from '../../../ui/tooltip/tooltip.directive';
import { MyIdAuthService } from '../../services/auth/myid-auth.browser.service';
import { MyIdRouteInfo } from '../../../id/utils/my-id-route-info';

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
  color = input<IdTheme>('primary');
  showTooltip = input(true);
  swaggerIconSvg = input(AppSvgs.SWAGGER_ICON);

  protected _swaggerUrlWithParams = computed(() => `${this.swaggerPath()}?${MyIdRouteInfo.Params.SWAGGER_TOKEN_KEY}=${this._authService.accessToken()}`)
  
  //- - - - - - - - - - -//

  protected goToSwagger() {
    const token = this._authService.accessToken();
    if (!token)//there might be a cookie  so don't return
      this._toast.warning('You must be logged in to access Swagger')
    

    const url = `${this.swaggerPath()}?tkn=${token}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }


}
