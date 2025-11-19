import { InjectionToken } from '@angular/core';

//###########################################//

export type MyIdOauthProviderId = 'google'
  | 'facebook'
  | 'amazon'
  // | 'microsoft'
  // | 'other';

//###########################################//

export interface MyIdOauthProviderDef {
  id: MyIdOauthProviderId;
  /** Optional third-party provider id (e.g. GoogleLoginProvider.PROVIDER_ID) */
  providerId?: string;
  /** Friendly display name for UI */
  displayName?: string;
  /** Whether this provider is enabled / configured */
  enabled: boolean;
  /** Optional metadata for future extensions */
  meta?: Record<string, any>;
}

//###########################################//

/**
 * Multi provider token that other provider factories can contribute to when they
 * configure a social provider. Consumers (UI state/components) inject this
 * token to discover which providers are available without depending on the
 * third-party library types.
 */
// Per-provider convenience tokens (boolean availability)
export const MYID_HAS_GOOGLE = new InjectionToken<boolean>('MYID_HAS_GOOGLE');
export const MYID_HAS_FACEBOOK = new InjectionToken<boolean>('MYID_HAS_FACEBOOK');
export const MYID_HAS_AMAZON = new InjectionToken<boolean>('MYID_HAS_AMAZON');

// Optional metadata tokens for each provider (can be null on server)
export const MYID_GOOGLE_PROVIDER = new InjectionToken<MyIdOauthProviderDef | null>('MYID_GOOGLE_PROVIDER');
export const MYID_FACEBOOK_PROVIDER = new InjectionToken<MyIdOauthProviderDef | null>('MYID_FACEBOOK_PROVIDER');
export const MYID_AMAZON_PROVIDER = new InjectionToken<MyIdOauthProviderDef | null>('MYID_AMAZON_PROVIDER');


