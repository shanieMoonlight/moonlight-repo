import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { Provider } from '@angular/core';
import { environment } from '../../environments/environment';

export class SocialAuthSetup {


  static provideSocialLoginConfig(): Provider[] {
    return [
      {
        provide: 'SocialAuthServiceConfig',
        useValue: {
          autoLogin: false,
          lang: 'en',
          providers: [
            {
              id: GoogleLoginProvider.PROVIDER_ID,
              provider: new GoogleLoginProvider(
                environment.oauth.client_id,
              )
            },
            // {
            //   id: FacebookLoginProvider.PROVIDER_ID,
            //   provider: new FacebookLoginProvider('clientId')
            // }
          ],
          onError: (err) => {
            console.error(err);
          }
        } as SocialAuthServiceConfig,
      }
    ]
  }


}
