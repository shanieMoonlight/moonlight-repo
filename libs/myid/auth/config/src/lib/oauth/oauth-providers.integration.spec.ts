import { Injector } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { MyIdOAuth } from './oauth-providers';
import { MYID_HAS_GOOGLE, MYID_GOOGLE_PROVIDER, MYID_HAS_FACEBOOK, MYID_FACEBOOK_PROVIDER, MYID_HAS_AMAZON, MYID_AMAZON_PROVIDER } from './tokens';

describe('oath-providers integration (DI)', () => {
  it('bootstraps an injector with provided providers and resolves DI tokens', () => {
    // Build providers as an app would (all three configured)
    const providers = [
      ...MyIdOAuth.provideLogins('google-id', 'facebook-id', 'amazon-id'),
      // supply PLATFORM_ID so factories treat environment as browser
      { provide: PLATFORM_ID, useValue: 'browser' }
    ];

    const injector = Injector.create({ providers });

    // Availability tokens should resolve to booleans
    const hasGoogle = injector.get(MYID_HAS_GOOGLE as any);
    const hasFacebook = injector.get(MYID_HAS_FACEBOOK as any);
    const hasAmazon = injector.get(MYID_HAS_AMAZON as any);

    expect(hasGoogle).toBe(true);
    expect(hasFacebook).toBe(true);
    expect(hasAmazon).toBe(true);

    // Meta provider tokens should resolve to provider defs
    const gMeta = injector.get(MYID_GOOGLE_PROVIDER as any) as any;
    const fMeta = injector.get(MYID_FACEBOOK_PROVIDER as any) as any;
    const aMeta = injector.get(MYID_AMAZON_PROVIDER as any) as any;

    expect(gMeta).toBeDefined();
    expect(gMeta.displayName).toBe('Google');
    expect(fMeta).toBeDefined();
    expect(fMeta.displayName).toBe('Facebook');
    expect(aMeta).toBeDefined();
    expect(aMeta.displayName).toBe('Amazon');

    // Also verify the SocialAuthServiceConfig that was registered by the helper
    const authConfig = injector.get('SocialAuthServiceConfig' as any) as any;
    expect(authConfig).toBeDefined();
    expect(Array.isArray(authConfig.providers)).toBe(true);
    const ids = authConfig.providers.map((p: any) => p.id);
    expect(ids).toContain('GOOGLE');
    expect(ids).toContain('FACEBOOK');
    expect(ids).toContain('AMAZON');
  });
});
