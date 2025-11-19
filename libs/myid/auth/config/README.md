# @spider-baby/myid-auth/config

Secondary entry point of `@spider-baby/myid-auth`. It can be used by importing from `@spider-baby/myid-auth/config`.

## Quick Start — Social login wiring

Use the fluent `MyIdOAuthBuilder` to register social providers.

Builder API — recommended:

```ts
import { MyIdOAuthBuilder } from '@spider-baby/myid-auth/config';
import { environment } from '../environments/environment';

providers: [
  ...MyIdOAuthBuilder.create()
	.provideGoogleLogin(environment.oauth.google.client_id)
	.provideFacebookLogin(environment.oauth.faceBook.client_id)
	// optionally call .provideAmazonLogin(...)
	.buildProviders()
]
```

Notes:
- The APIs return a `SocialAuthServiceConfig` provider (SSR-safe) and the per-provider DI tokens (`MYID_HAS_GOOGLE`, `MYID_GOOGLE_PROVIDER`, etc.).
- The builder is more discoverable and easier to extend with provider-specific options later.
- Consumers (components/services) should inject those tokens from `@spider-baby/myid-auth/config` to detect configured providers without depending on the third-party library.

See `OAUTH-MIGRATION.md` for migration notes, testing suggestions, and design rationale.

Internal helpers
----------------
This package contains an internal module `src/lib/oauth/oauth-providers.internal.ts` with helper builders and token-maker functions used by the provider implementation. Those helpers are intentionally not exported from the package barrel (`src/index.ts`) so they remain internal implementation details. Tests in this package import the internal module directly; application code should use the public API (`MyIdOAuthBuilder` and the exported tokens) only.

**Exported Tokens**

-- **`MYID_HAS_GOOGLE`**: boolean — true in browser when Google login is registered via the builder API, false on server. Use this to show/hide Google sign-in UI without importing the social-login library.
- **`MYID_HAS_FACEBOOK`**: boolean — same semantics as `MYID_HAS_GOOGLE` for Facebook.
- **`MYID_HAS_AMAZON`**: boolean — same semantics as above for Amazon login.
- **`MYID_GOOGLE_PROVIDER`**: `MyIdOauthProviderDef | null` — optional metadata object (on browser) describing the configured Google provider: `{ id, providerId, displayName, enabled }`. Null on server.
- **`MYID_FACEBOOK_PROVIDER`**: `MyIdOauthProviderDef | null` — Facebook provider metadata (or null on server).
- **`MYID_AMAZON_PROVIDER`**: `MyIdOauthProviderDef | null` — Amazon provider metadata (or null on server).

**Token Types**

- **`MyIdOauthProviderDef`**: interface describing provider metadata.
	- **`id`**: provider id literal (`'google'|'facebook'|'amazon'`).
	- **`providerId`**: optional third-party provider id (e.g. `GoogleLoginProvider.PROVIDER_ID`).
	- **`displayName`**: friendly label for UI.
	- **`enabled`**: boolean indicating configured/enabled state.

**Usage Examples**

- **Bootstrap wiring (App startup)**: add providers returned by `MyIdOAuth.provideLogins(...)` to your `providers` array when bootstrapping the app.

```ts
import { MyIdOAuth } from '@spider-baby/myid-auth/config';

bootstrapApplication(AppComponent, {
	providers: [
		...MyIdOAuth.provideLogins(
			environment.oauth.google.client_id,
			environment.oauth.faceBook.client_id,
			environment.oauth.amazon.client_id
		)
	]
});
```

- **Consume tokens in a service or component (SSR-safe)**: inject tokens optionally and default sensibly to avoid DI errors on server.

```ts
import { Inject, Injectable, Optional } from '@angular/core';
import { MYID_HAS_GOOGLE, MYID_GOOGLE_PROVIDER } from '@spider-baby/myid-auth/config';

@Injectable({ providedIn: 'root' })
export class LoginUiService {
	constructor(
		@Optional() @Inject(MYID_HAS_GOOGLE) private hasGoogle?: boolean,
		@Optional() @Inject(MYID_GOOGLE_PROVIDER) private googleMeta?: any
	) {}

	showGoogleButton(): boolean {
		return !!this.hasGoogle && !!this.googleMeta?.enabled;
	}
}
```

**Testing**

- Unit tests can mock these tokens by providing simple provider overrides in the test `Injector` (or TestBed):

```ts
{ provide: MYID_HAS_GOOGLE, useValue: true }
{ provide: MYID_GOOGLE_PROVIDER, useValue: { id: 'google', providerId: 'GOOGLE', displayName: 'Google', enabled: true } }
```

Use the token metadata to keep presentation code decoupled from the third-party SDK and to make server renders deterministic.

---

## Troubleshooting & Notes

- If a consumer sees social buttons on server-side rendered pages, ensure your `PLATFORM_ID` is correctly provided and you used the `MyIdOAuth.provideLogins(...)` helper at bootstrap-time. The availability tokens are intentionally false/null on the server to keep SSR deterministic.
- If you need runtime toggling of providers (rare), implement a small service that exposes Signals/BehaviorSubjects instead of changing token semantics.

If you'd like, a runnable `main.ts` snippet is included here showing how to bootstrap with only Google configured using the builder API.

Runnable `main.ts` example (Google only)

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { MyIdOAuthBuilder } from '@spider-baby/myid-auth/config';

@Component({
	selector: 'app-root',
	standalone: true,
	template: `<h1>MyId OAuth demo (Google only)</h1>`
})
class AppComponent {}

const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';

bootstrapApplication(AppComponent, {
	providers: [
		// Configure only Google login at bootstrap using the builder API
		...MyIdOAuthBuilder.create()
			.provideGoogleLogin(GOOGLE_CLIENT_ID)
			.buildProviders()
	]
}).catch(err => console.error('Bootstrap error', err));

// For a runnable example file see `libs/myid/auth/config/examples/bootstrap-google/application.config.ts` in the repository.

