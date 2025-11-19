import { AmazonLoginProvider, FacebookLoginProvider, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { Provider, PLATFORM_ID } from '@angular/core';
import { MyIdOauthProviderDef, MYID_HAS_GOOGLE, MYID_HAS_FACEBOOK, MYID_HAS_AMAZON, MYID_GOOGLE_PROVIDER, MYID_FACEBOOK_PROVIDER, MYID_AMAZON_PROVIDER, MyIdOauthProviderId } from './tokens';
import { isPlatformBrowser } from '@angular/common';

// NOTE: This file contains internal helper builders and token-makers used
// by `oath-providers.ts`. It is intentionally not exported from the
// package barrel (`src/index.ts`) so that these helpers remain internal
// implementation details and are available only for tests in this package.
// Keeping them out of the public barrel avoids polluting the public API.

export function buildGoogleProvider(clientId: string) {
    return {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider(
            clientId,
            { scopes: 'profile email' }
        )
    };
}

export function buildFacebookProvider(clientId: string) {
    return {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider(
            clientId,
            { scope: 'email', return_scopes: true, enable_profile_selector: true }
        )
    };
}

export function buildAmazonProvider(clientId: string) {
    return {
        id: AmazonLoginProvider.PROVIDER_ID,
        provider: new AmazonLoginProvider(
            clientId,
            { scope: 'profile' }
        )
    };
}

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
