import { MyIdOAuthBuilder } from './oauth-providers.builder';
import { MYID_HAS_GOOGLE, MYID_HAS_FACEBOOK, MYID_HAS_AMAZON } from './tokens';

describe('MyIdOAuthBuilder', () => {
  it('registers token providers for configured providers', () => {
    const providers = MyIdOAuthBuilder.create()
      .provideGoogleLogin('google-id')
      .provideFacebookLogin('fb-id')
      .buildProviders();

    expect(providers.some((p: any) => p.provide === MYID_HAS_GOOGLE)).toBeTruthy();
    expect(providers.some((p: any) => p.provide === MYID_HAS_FACEBOOK)).toBeTruthy();
    expect(providers.some((p: any) => p.provide === MYID_HAS_AMAZON)).toBeFalsy();
  });

  it('produces an empty SocialAuthServiceConfig.providers on server', () => {
    const providers = MyIdOAuthBuilder.create()
      .provideGoogleLogin('google-id')
      .provideFacebookLogin('fb-id')
      .buildProviders();

    const authProv = providers.find((p: any) => p.provide === 'SocialAuthServiceConfig') as any;
    expect(authProv).toBeDefined();

    // Simulate server platform -> should not construct third-party providers
    const cfg = authProv.useFactory('server');
    expect(cfg).toBeDefined();
    expect(Array.isArray(cfg.providers)).toBeTruthy();
    expect(cfg.providers.length).toBe(0);
  });

  it('constructs provider entries when run on browser', () => {
    const providers = MyIdOAuthBuilder.create()
      .provideGoogleLogin('google-id')
      .provideFacebookLogin('fb-id')
      .provideAmazonLogin('amazon-id')
      .buildProviders();

    const authProv = providers.find((p: any) => p.provide === 'SocialAuthServiceConfig') as any;
    expect(authProv).toBeDefined();

    // Simulate browser platform -> builder should construct provider instances
    const cfg = authProv.useFactory('browser');
    expect(cfg).toBeDefined();
    expect(Array.isArray(cfg.providers)).toBeTruthy();
    // three configured providers -> providers array should contain three entries
    expect(cfg.providers.length).toBe(3);
  });
});
