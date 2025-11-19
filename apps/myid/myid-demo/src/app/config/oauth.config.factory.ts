import { Provider } from '@angular/core';
import { MyIdOAuthBuilder } from '@spider-baby/myid-auth/config';
import { environment } from '../../environments/environment';

export class SocialAuthSetup {

  static provideSocialLoginConfig(): Provider[] {
    return MyIdOAuthBuilder.create()
      .provideGoogleLogin(environment.oauth.google.client_id)
      .provideFacebookLogin(environment.oauth.faceBook.client_id)
      .provideAmazonLogin(environment.oauth.amazon.client_id)
      .buildProviders();
  }
  
}
