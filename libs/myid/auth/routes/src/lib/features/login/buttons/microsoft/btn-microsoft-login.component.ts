import { MicrosoftLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { devConsole } from '@spider-baby/dev-console';
import { SbIconButtonComponent } from '@spider-baby/ui-kit/buttons';
import { SbTooltipDirective } from '@spider-baby/ui-kit/tooltip';

//###############################################//

const AMAZON_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23"><path fill="#f3f3f3" d="M0 0h23v23H0z"/>
  <path fill="#f35325" d="M1 1h10v10H1z"/>
  <path fill="#81bc06" d="M12 1h10v10H12z"/>
  <path fill="#05a6f0" d="M1 12h10v10H1z"/>
  <path fill="#ffba08" d="M12 12h10v10H12z"/>
</svg>`

//###############################################//



@Component({
  selector: 'sb-button-microsoft-login',
  imports: [
    SbIconButtonComponent,
    SbTooltipDirective
  ],
  template: `
      <sb-icon-button         
          [sbTooltip]="showTooltip() ? 'Microsoft' : ''"
          aria-label="Microsoft Oauth Login"
          (click)="login()"
          [svgString]="faceBookIconSvg()"/>`,
  styles: `
    :host {
      display: inline-block;
      background-color: white;
      width: fit-content;
      border-radius: 4px;
    }
    sb-icon-button{      
      width: 40px;
      height: 40px;
    }
    svg{      
    width: 100%;
    height: 100%;
    } 
    .svg-container{
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * SbButtonMicrosoftLoginComponent
 *
 * Button component that initiates a Microsoft OAuth sign-in using the injected SocialAuthService.
 * When user clicks the button, it triggers the Microsoft login flow.
 * Which when successful, triggers SocialAuthService.authStage with the MicrosoftUserData which can be subscribed to.
 * 
 *  ngOnInit() {

    this._socialAuth.authState
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((socialUser) => {
        devConsole.log('socialUser', socialUser);

        if (socialUser) {
          const provider = socialUser.provider;
          devConsole.log(`Social login successful from provider: ${provider}`, socialUser);

          switch (provider) {
            case GoogleLoginProvider.PROVIDER_ID:
              devConsole.log('Google social login response', socialUser);
              this._state.loginGoogle(socialUser);
              break;
            case MicrosoftLoginProvider.PROVIDER_ID:
              devConsole.log('Microsoft social login response', socialUser);
              this._state.loginMicrosoft(socialUser);
              break;
            case MicrosoftLoginProvider.PROVIDER_ID:
              devConsole.log('Microsoft social login response', socialUser);
              this._state.loginMicrosoft(socialUser);
              break;
            default:
              devConsole.warn('Unsupported social login provider:', provider);
              return;
          }

        }
      })
  }
 *
 * @remarks
 * - Injects SocialAuthService to perform the sign-in flow for the Microsoft provider.
 * - Exposes a `login` method that triggers the provider sign-in.
 * - Exposes inputs to control tooltip visibility and to supply the Microsoft SVG icon markup.
 *
 * @example
 * <sb-button-microsoft-login 
 *  [showTooltip]="true" 
 *  [faceBookIconSvg]="microsoftSvg"/> //Optional
 *
 * @property {SocialAuthService} _socialAuth - (private) Injected SocialAuthService used to perform sign-in operations.
 * @property {() => Promise<any>} login - Initiates sign-in with the Microsoft provider (delegates to SocialAuthService.signIn).
 * @property {boolean} showTooltip - Input: when true, a tooltip is shown for the button. Defaults to `true`.
 * @property {string} faceBookIconSvg - Input: SVG markup (or identifier) used to render the Microsoft icon. Defaults to `AMAZON_ICON`.
 */
export class SbButtonMicrosoftLoginComponent {

  private _socialAuth = inject(SocialAuthService)
  
  //- - - - - - - - - - - - - //
  
  showTooltip = input(true);

  /** Alternative icon (svg) */
  faceBookIconSvg = input(AMAZON_ICON);


  socialUser = output<SocialUser>();

  //- - - - - - - - - - - - - //
    
  protected login = () => this._socialAuth.signIn(MicrosoftLoginProvider.PROVIDER_ID)
      .then((response) => {
        devConsole.log('Microsoft login initiated', response);
        this.socialUser.emit(response);
      });

}//Cls
