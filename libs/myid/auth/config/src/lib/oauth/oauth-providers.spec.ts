import { MyIdOAuth } from './oauth-providers';
import { MYID_HAS_GOOGLE, MYID_GOOGLE_PROVIDER, MYID_HAS_FACEBOOK, MYID_FACEBOOK_PROVIDER, MYID_HAS_AMAZON, MYID_AMAZON_PROVIDER } from './tokens';
import { GoogleLoginProvider, FacebookLoginProvider, AmazonLoginProvider } from '@abacritt/angularx-social-login';
import { makePerProviderTokens } from './oauth-providers.internal';

describe('oath-providers convenience helper', () => {
  it('registers google token providers when googleClientId provided', () => {
    const providers = MyIdOAuth.provideLogins('google-client-id') as any[];

    // Expect the SocialAuthServiceConfig provider to be present
    const configProvider = providers.find((p: any) => p && p.provide === 'SocialAuthServiceConfig');
    expect(configProvider).toBeDefined();

    // Expect per-provider token providers for Google to be present
    const hasGoogle = providers.find((p: any) => p && p.provide === MYID_HAS_GOOGLE);
    const metaGoogle = providers.find((p: any) => p && p.provide === MYID_GOOGLE_PROVIDER);
    expect(hasGoogle).toBeDefined();
    expect(metaGoogle).toBeDefined();

    // The meta provider factory should return provider metadata on browser, null on server
    const metaGoogleDef = (metaGoogle as any).useFactory('browser');
    expect(metaGoogleDef).toBeDefined();
    expect(metaGoogleDef.displayName).toBe('Google');
    expect(metaGoogleDef.enabled).toBe(true);
    expect((metaGoogle as any).useFactory('server')).toBeNull();
  });

  //- - - - - - - - - - - - - //

  it('SocialAuthServiceConfig factory constructs providers only on browser', () => {
    const providers = MyIdOAuth.provideLogins('g-id', 'f-id') as any[];
    const configProvider: any = providers.find((p: any) => p && p.provide === 'SocialAuthServiceConfig');
    expect(configProvider).toBeDefined();

    // Simulate server (non-browser)
    const serverConfig = configProvider.useFactory('server');
    expect(serverConfig).toBeDefined();
    expect(Array.isArray(serverConfig.providers)).toBe(true);
    expect(serverConfig.providers.length).toBe(0);

    // Simulate browser
    const browserConfig = configProvider.useFactory('browser');
    expect(browserConfig).toBeDefined();
    expect(Array.isArray(browserConfig.providers)).toBe(true);
    // Both google and facebook should be present
    const ids = browserConfig.providers.map((p: any) => p.id);
    expect(ids).toContain(GoogleLoginProvider.PROVIDER_ID);
    expect(ids).toContain(FacebookLoginProvider.PROVIDER_ID);
  });

  //- - - - - - - - - - - - - //

  it('registers facebook tokens when facebookClientId provided', () => {
    const providers = MyIdOAuth.provideLogins(undefined, 'facebook-client-id') as any[];
    const hasFb = providers.find((p: any) => p && p.provide === MYID_HAS_FACEBOOK);
    const metaFb = providers.find((p: any) => p && p.provide === MYID_FACEBOOK_PROVIDER);
    expect(hasFb).toBeDefined();
    expect(metaFb).toBeDefined();

    // facebook meta provider factory should return provider metadata on browser
    const metaFbDef = (metaFb as any).useFactory('browser');
    expect(metaFbDef).toBeDefined();
    expect(metaFbDef.displayName).toBe('Facebook');
    expect(metaFbDef.enabled).toBe(true);
    expect((metaFb as any).useFactory('server')).toBeNull();
  });

  // - - - - - - - - - - - - - //

  it('makePerProviderTokens returns availability + meta providers for amazon and factories behave correctly', () => {
    const providers = makePerProviderTokens('amazon') as any[];
    // Should return two providers
    expect(providers.length).toBe(2);

    const hasAmazon = providers.find((p: any) => p && p.provide === MYID_HAS_AMAZON);
    const metaAmazon = providers.find((p: any) => p && p.provide === MYID_AMAZON_PROVIDER);
    expect(hasAmazon).toBeDefined();
    expect(metaAmazon).toBeDefined();

    // availability factory: browser -> true, server -> false
    expect((hasAmazon as any).useFactory('browser')).toBe(true);
    expect((hasAmazon as any).useFactory('server')).toBe(false);

    // meta factory: browser -> provider def, server -> null
    const metaDef = (metaAmazon as any).useFactory('browser');
    expect(metaDef).toBeDefined();
    expect(metaDef.id).toBe('amazon');
    expect(metaDef.providerId).toBe(AmazonLoginProvider.PROVIDER_ID);
    expect(metaDef.displayName).toBe('Amazon');
    expect(metaDef.enabled).toBe(true);
    expect((metaAmazon as any).useFactory('server')).toBeNull();
  });
});



