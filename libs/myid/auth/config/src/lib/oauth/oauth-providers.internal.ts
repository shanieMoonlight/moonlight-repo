import { AmazonLoginProvider, BaseLoginProvider, FacebookLoginProvider, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { Provider, PLATFORM_ID } from '@angular/core';
import { MyIdOauthProviderDef, MYID_HAS_GOOGLE, MYID_HAS_FACEBOOK, MYID_HAS_AMAZON, MYID_GOOGLE_PROVIDER, MYID_FACEBOOK_PROVIDER, MYID_AMAZON_PROVIDER, MyIdOauthProviderId } from './tokens';
import { isPlatformBrowser } from '@angular/common';

// NOTE: This file contains internal helper builders and token-makers used
// by `oath-providers.ts`. It is intentionally not exported from the
// package barrel (`src/index.ts`) so that these helpers remain internal
// implementation details and are available only for tests in this package.
// Keeping them out of the public barrel avoids polluting the public API.

/**
 * Build a Google provider entry for `SocialAuthServiceConfig.providers`.
 *
 * This returns the shape expected by `@abacritt/angularx-social-login`:
 * `{ id, provider }` where `provider` is an instance of
 * `GoogleLoginProvider` configured with the given `clientId`.
 *
 * Note: construction of the provider instance should only occur on the
 * browser (the caller is responsible for guarding with `isPlatformBrowser`).
 *
 * @param clientId Google OAuth client id
 */
export function buildGoogleProvider(clientId: string) {
    return {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider(
            clientId,
            { scopes: 'profile email' }
        )
    };
}

//- - - - - - - - - - //


/**
 * Build a Facebook provider entry for `SocialAuthServiceConfig.providers`.
 *
 * Returns `{ id, provider }` where `provider` is an instance of
 * `FacebookLoginProvider` configured with the supplied `clientId` and
 * recommended options.
 *
 * @param clientId Facebook OAuth client id
 */
export function buildFacebookProvider(clientId: string) {
    return {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider(
            clientId,
            { scope: 'email', return_scopes: true, enable_profile_selector: true }
        )
    };
}

//- - - - - - - - - - //


/**
 * Build an Amazon provider entry for `SocialAuthServiceConfig.providers`.
 *
 * Returns `{ id, provider }` where `provider` is an instance of
 * `AmazonLoginProvider` configured with the supplied `clientId`.
 *
 * @param clientId Amazon OAuth client id
 */
export function buildAmazonProvider(clientId: string) {
    return {
        id: AmazonLoginProvider.PROVIDER_ID,
        provider: new AmazonLoginProvider(
            clientId,
            { scope: 'profile' }
        )
    };
}


//- - - - - - - - - - //


/**
 * Generic helper to build a `{ id, provider }` entry when a caller already
 * has a `BaseLoginProvider` instance.
 *
 * @param providerId the provider id string (e.g. GoogleLoginProvider.PROVIDER_ID)
 * @param provider an instance of a `BaseLoginProvider`
 */
export function buildOAuthProvider(providerId: string, provider: BaseLoginProvider) {
    return {
        id: providerId,
        provider: provider
    };
}



//--------------------//


/**
 * Create per-provider DI token providers for the given provider id.
 *
 * Returns an array with two Angular `Provider`s:
 * - a boolean availability token (e.g. `MYID_HAS_GOOGLE`) whose factory
 *   returns `true` on the browser and `false` on the server, and
 * - a metadata token (e.g. `MYID_GOOGLE_PROVIDER`) whose factory returns a
 *   `MyIdOauthProviderDef` object on the browser and `null` on the server.
 *
 * These tokens let application code detect which providers were configured
 * at bootstrap time without importing third-party types.
 *
 * @param id provider id literal: 'google' | 'facebook' | 'amazon'
 */
export function makePerProviderTokens(id: MyIdOauthProviderId): Provider[] {
    let boolToken: any;
    let metaToken: any;
    let providerId: string;
    let displayName: string;

    switch (id) {
        case 'google':
            boolToken = MYID_HAS_GOOGLE;
            metaToken = MYID_GOOGLE_PROVIDER;
            providerId = GoogleLoginProvider.PROVIDER_ID;
            displayName = 'Google';
            break;
        case 'facebook':
            boolToken = MYID_HAS_FACEBOOK;
            metaToken = MYID_FACEBOOK_PROVIDER;
            providerId = FacebookLoginProvider.PROVIDER_ID;
            displayName = 'Facebook';
            break;
        case 'amazon':
            boolToken = MYID_HAS_AMAZON;
            metaToken = MYID_AMAZON_PROVIDER;
            providerId = AmazonLoginProvider.PROVIDER_ID;
            displayName = 'Amazon';
            break;
        default:
            throw new Error(`Unsupported provider id: ${id}`);
    }

    const availabilityProvider: Provider = {
        provide: boolToken,
        useFactory: (platformId: Object) => isPlatformBrowser(platformId) ? true : false,
        deps: [PLATFORM_ID]
    };

    const metaProvider: Provider = {
        provide: metaToken,
        useFactory: (platformId: Object) => isPlatformBrowser(platformId) ? ({ id, providerId, displayName, enabled: true } as MyIdOauthProviderDef) : null,
        deps: [PLATFORM_ID]
    };

    return [availabilityProvider, metaProvider];
}
