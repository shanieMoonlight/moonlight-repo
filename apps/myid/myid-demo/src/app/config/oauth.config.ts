import { AmazonLoginProvider, FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { Provider } from '@angular/core';
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
        useValue: {
          autoLogin: false,
          lang: 'en',
          providers: [
            {
              id: GoogleLoginProvider.PROVIDER_ID,
              provider: new GoogleLoginProvider(
                environment.oauth.google.client_id, googleLoginOptions
              )
            },
            {
              id: FacebookLoginProvider.PROVIDER_ID,
              provider: new FacebookLoginProvider(
                environment.oauth.faceBook.client_id, fbLoginOptions
              )
            },
            {
              id: AmazonLoginProvider.PROVIDER_ID,
              provider: new AmazonLoginProvider(
                environment.oauth.amazon.client_id, amazonLoginOptions
              )
            }
          ],
          onError: (err) => {
            console.error(err);
          }
        } as SocialAuthServiceConfig,
      }
    ]
  }


}


