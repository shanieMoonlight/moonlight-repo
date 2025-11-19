import { SocialAuthServiceConfig } from "@abacritt/angularx-social-login";
import { isPlatformBrowser } from "@angular/common";
import { PLATFORM_ID, Provider } from "@angular/core";
import { buildAmazonProvider, buildFacebookProvider, buildGoogleProvider, makePerProviderTokens } from "./oauth-providers.internal";
import { MyIdOauthProviderId } from "./tokens";


interface ProviderData {
    clientId: string;
    id: MyIdOauthProviderId;
}


/**
 * Convenience class wrapper for discoverability. Callers can use
 * `MyIdOAuth.provideLogins(...)` as a clear entrypoint to wire social
 * providers and register per-provider tokens.
 */
/**
 * Fluent builder to configure social OAuth providers and produce an Angular
 * `Provider[]` suitable for app bootstrap. The builder collects provider
 * client IDs and, when `buildProviders()` is called, returns:
 * - a `SocialAuthServiceConfig` provider whose factory will construct
 *   third-party provider instances only on the browser (SSR-safe), and
 * - per-provider DI token providers (via `makePerProviderTokens`) that
 *   allow the application to detect which providers are configured.
 *
 * Usage:
 * ```ts
 * ...MyIdOAuthBuilder.create()
 *   .provideGoogleLogin(googleId)
 *   .provideFacebookLogin(fbId)
 *   .buildProviders()
 * ```
 */
export class MyIdOAuthBuilder {

    private _providersData: ProviderData[] = [];

    private constructor() { }

    /**
     * Create a new builder instance.
     */
    static create = () => new MyIdOAuthBuilder()

    //--------------------//

    /**
     * Configure Google login with the provided OAuth client id.
     * @param clientId Google OAuth client id
     * @returns the builder (for chaining)
     */
    provideGoogleLogin(clientId: string) {
        this._providersData.push({ clientId, id: 'google' });
        return this;
    }

    /**
     * Configure Facebook login with the provided OAuth client id.
     * @param clientId Facebook OAuth client id
     * @returns the builder (for chaining)
     */
    provideFacebookLogin(clientId: string) {
        this._providersData.push({ clientId, id: 'facebook' });
        return this;
    }

    /**
     * Configure Amazon login with the provided OAuth client id.
     * @param clientId Amazon OAuth client id
     * @returns the builder (for chaining)
     */
    provideAmazonLogin(clientId: string) {
        this._providersData.push({ clientId, id: 'amazon' });
        return this;
    }
    //--------------------//

    /**
     * Build the Angular providers array.
     *
     * The returned array contains a `SocialAuthServiceConfig` provider with a
     * factory that will only instantiate third-party provider instances when
     * running in a browser (via `isPlatformBrowser`). It also includes the
     * per-provider DI tokens created by `makePerProviderTokens` so consumers
     * can check availability.
     *
     * @returns Angular `Provider[]` suitable for inclusion in a `providers` array
     */
    buildProviders(): Provider[] {

        const tokenProviders: Provider[] = this._providersData
            .map(pd => makePerProviderTokens(pd.id)).flat();

        return [
            {
                provide: 'SocialAuthServiceConfig',
                useFactory: (platformId: Object) => {
                    const isBrowser = isPlatformBrowser(platformId);

                    const providers: Array<any> = [];
                    //Only build providers on browser
                    if (isBrowser) {
                        const googleClientId = this.findClientId('google');
                        if (googleClientId)
                            providers.push(buildGoogleProvider(googleClientId));

                        const faceBookClientId = this.findClientId('facebook');
                        if (faceBookClientId)
                            providers.push(buildFacebookProvider(faceBookClientId));

                        const amazonClientId = this.findClientId('amazon');
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

    //--------------------//

    /**
     * Internal helper to find the configured client id for a provider id.
     * Returns `undefined` when not configured.
     */
    private findClientId = (id: MyIdOauthProviderId): string =>
        this._providersData.filter(pd => pd.id === id)
            .map(pd => pd.clientId)[0];


}//Cls