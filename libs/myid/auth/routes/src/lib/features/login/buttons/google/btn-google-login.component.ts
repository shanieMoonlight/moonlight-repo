import { GoogleLoginProvider, GoogleSigninButtonDirective, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, OnInit, output, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SbTooltipDirective } from '@spider-baby/ui-kit/tooltip';



@Component({
  selector: 'sb-button-google-login',
  imports: [
    GoogleSigninButtonDirective,
    SbTooltipDirective
  ],
  template: `
   @if (_isBrowser) {
        <asl-google-signin-button 
          [type]="type()" 
          [size]="size()" 
          [text]="text()" 
          [shape]="shape()" 
          [logo_alignment]="logo_alignment()" 
          [width]="width()" 
          [locale]="locale()" 
          [sbTooltip]="'Google'"/>
      }`,
  styles: `  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbButtonGoogleLoginComponent implements OnInit {

  private _platformId = inject(PLATFORM_ID)
  private _socialAuth = inject(SocialAuthService)
  private _destroyRef = inject(DestroyRef)

  //- - - - - - - - - - - - - //

  type = input<'icon' | 'standard'>('icon');
  size = input<'small' | 'medium' | 'large'>('large');
  text = input<'signin_with' | 'signup_with' | 'continue_with'>('signin_with');
  shape = input<'square' | 'circle' | 'pill' | 'rectangular'>('rectangular');
  theme = input<'outline' | 'filled_blue' | 'filled_black'>('outline');
  logo_alignment = input<'left' | 'center'>('left');
  width = input(0);
  locale = input('');
  showTooltip = input(true);

  socialUser = output<SocialUser>()

  //- - - - - - - - - - - - - //

  protected _isBrowser = isPlatformBrowser(this._platformId)

  //- - - - - - - - - - - - - //

  ngOnInit() {
    this._socialAuth.authState
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((socialUser) => {
        if (socialUser && socialUser.provider == GoogleLoginProvider.PROVIDER_ID)
          this.socialUser.emit(socialUser)
      })
  }

}//Cls
