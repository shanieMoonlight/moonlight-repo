export type OauthProviders = 'google' | 'facebook' | 'amazon';
import { GoogleLoginProvider, FacebookLoginProvider, AmazonLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { Provider, PLATFORM_ID } from '@angular/core';
import { MyIdOauthProviderDef, MYID_HAS_GOOGLE, MYID_HAS_FACEBOOK, MYID_HAS_AMAZON, MYID_GOOGLE_PROVIDER, MYID_FACEBOOK_PROVIDER, MYID_AMAZON_PROVIDER, MyIdOauthProviderId } from './tokens';
import { isPlatformBrowser } from '@angular/common';
import { buildGoogleProvider, buildFacebookProvider, buildAmazonProvider, makePerProviderTokens } from './oath-providers.internal';


//-------------------------//


// option objects moved into internal builders to keep this file focused

//-------------------------//

function provideMyIdSocialLogin(
    googleClientId: string | undefined = undefined,
    faceBookClientId: string | undefined = undefined,
    amazonClientId: string | undefined = undefined
): Provider[] {
    
    const tokenProviders: Provider[] = [];

    if (googleClientId)
        tokenProviders.push(...makePerProviderTokens('google'));

    if (faceBookClientId)
        tokenProviders.push(...makePerProviderTokens('facebook'));

    if (amazonClientId)
        tokenProviders.push(...makePerProviderTokens('amazon'));

    return [
        {
            provide: 'SocialAuthServiceConfig',
            useFactory: (platformId: Object) => {
                const isBrowser = isPlatformBrowser(platformId);

              const providers: Array<any> = [];

                if (isBrowser) {
                    if (googleClientId)
                        providers.push(buildGoogleProvider(googleClientId));
                    if (faceBookClientId)
                        providers.push(buildFacebookProvider(faceBookClientId));
                    if (amazonClientId)
                        providers.push(buildAmazonProvider(amazonClientId));
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
        },
        ...tokenProviders
    ];
}

//- - - - - - - - - - - - -//
// helpers are implemented in `oath-providers.internal.ts` and imported above

//-------------------------//

/**
 * Convenience class wrapper for discoverability. Callers can use
 * `MyIdOAuth.provideLogins(...)` as a clear entrypoint to wire social
 * providers and register per-provider tokens.
 */
export class MyIdOAuth {
    /**
     * Return an array of providers to wire social logins and register per-provider
     * availability tokens.
     *
     * Notes:
     * - The returned providers include a `SocialAuthServiceConfig` provider that
     *   constructs third-party provider instances only on the browser (SSR-safe).
     * - For each configured provider this also registers per-provider DI tokens
     *   (e.g. `MYID_HAS_GOOGLE`, `MYID_GOOGLE_PROVIDER`) so consumers can detect
     *   availability without depending on third-party types.
     *
     * Example:
     * ```ts
     * providers: [
     *   ...MyIdOAuth.provideLogins(
     *     environment.oauth.google.client_id,
     *     environment.oauth.faceBook.client_id
     *   )
     * ]
     * ```
     *
     * @param googleClientId Google client id (optional)
     * @param faceBookClientId Facebook client id (optional)
     * @param amazonClientId Amazon client id (optional)
     * @returns `Provider[]` suitable for adding to an Angular `providers` array
     */
    static provideLogins(
        googleClientId?: string,
        faceBookClientId?: string,
        amazonClientId?: string
    ): Provider[] {
        return provideMyIdSocialLogin(googleClientId, faceBookClientId, amazonClientId);
    }
}