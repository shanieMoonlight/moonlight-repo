import { Provider } from '@angular/core';
import { MyIdOAuth } from '@spider-baby/myid-auth/config';
import { environment } from '../../environments/environment';

export class SocialAuthSetup {
  static provideSocialLoginConfig(): Provider[] {
    return MyIdOAuth.provideLogins(
      environment.oauth.google.client_id,
      environment.oauth.faceBook.client_id,
      environment.oauth.amazon.client_id
    );
  }
}
