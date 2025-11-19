# @spider-baby/myid-auth/config

Secondary entry point of `@spider-baby/myid-auth`. It can be used by importing from `@spider-baby/myid-auth/config`.

## Quick Start — Social login wiring

Use the `MyIdOAuth.provideLogins(...)` helper to register supported social providers and the per-provider availability tokens.

Example (in `AppModule` or `bootstrapApplication` providers):

```ts
import { MyIdOAuth } from '@spider-baby/myid-auth/config';
import { environment } from '../environments/environment';

providers: [
	...MyIdOAuth.provideLogins(
		environment.oauth.google.client_id,
		environment.oauth.faceBook.client_id,
		environment.oauth.amazon.client_id
	)
]
```

Notes:
- The helper returns a `SocialAuthServiceConfig` provider (SSR-safe) and per-provider DI tokens like `MYID_HAS_GOOGLE` and `MYID_GOOGLE_PROVIDER`.
- Consumers (components/services) should inject those tokens from `@spider-baby/myid-auth/config` to detect configured providers without depending on the third-party library.

See `OAUTH-MIGRATION.md` for migration notes, testing suggestions, and design rationale.

Internal helpers
----------------
This package contains an internal module `src/lib/oauth/oath-providers.internal.ts` with helper builders and token-maker functions used by `oath-providers.ts`. Those helpers are intentionally not exported from the package barrel (`src/index.ts`) so they remain internal implementation details. Tests in this package import the internal module directly; application code should use the public API (`MyIdOAuth.provideLogins` and the exported tokens) only.

**Exported Tokens**

- **`MYID_HAS_GOOGLE`**: boolean — true in browser when Google login is registered via `MyIdOAuth.provideLogins(...)`, false on server. Use this to show/hide Google sign-in UI without importing the social-login library.
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

If you'd like, I can add a short example app `main.ts` snippet or a small testing harness that demonstrates how to bootstrap with only Google configured — say the README only has the conceptual example right now; I can add a runnable snippet on request.
