import { AmazonLoginProvider, FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { Provider, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';


const fbLoginOptions = {
  // scope: 'pages_messaging,pages_messaging_subscriptions,email,pages_show_list,manage_pages',
  scope: 'email',
  return_scopes: true,
  enable_profile_selector: true
}; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11

const googleLoginOptions = {
  scopes: 'profile email'
}; // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig

const vkLoginOptions = {
  fields: 'photo_max,contacts,name', // Profile fields to return, see: https://vk.com/dev/objects/user
  version: '5.124', // https://vk.com/dev/versions
}; // https://vk.com/dev/users.get

const amazonLoginOptions = {
  scope: 'profile', 
}; // https://developer.amazon.com/docs/login-with-amazon/requesting-scopes-as-essential-voluntary.html


export class SocialAuthSetup {


  static provideSocialLoginConfig(): Provider[] {
    return [
      {
        provide: 'SocialAuthServiceConfig',
        useFactory: (platformId: Object) => {
          const isBrowser = isPlatformBrowser(platformId);

          const providers: Array<any> = [];

          if (isBrowser) {
            providers.push({
              id: GoogleLoginProvider.PROVIDER_ID,
              provider: new GoogleLoginProvider(
                environment.oauth.google.client_id,
                googleLoginOptions
              )
            });

            providers.push({
              id: FacebookLoginProvider.PROVIDER_ID,
              provider: new FacebookLoginProvider(
                environment.oauth.faceBook.client_id, fbLoginOptions
              )
            });

            providers.push({
              id: AmazonLoginProvider.PROVIDER_ID,
              provider: new AmazonLoginProvider(
                environment.oauth.amazon.client_id, amazonLoginOptions
              )
            });
          }

          return {
            autoLogin: false,
            lang: 'en',
            providers,
            onError: (err: any) => {
              console.error(err);
            }
          } as SocialAuthServiceConfig;
        },
        deps: [PLATFORM_ID]
      }
    ];
  }


}
