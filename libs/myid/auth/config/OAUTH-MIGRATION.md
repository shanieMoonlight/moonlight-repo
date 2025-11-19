OAuth migration plan — Registry-based provider detection

Goal
-----
Show only social login buttons that have been configured, avoid runtime errors, and keep application code agnostic of `@abacritt/angularx-social-login`.

Overview
--------
We add a small DI surface that lets per-provider factory code declare which providers are configured at bootstrap time (SSRsafe). Consumers (login state and components) read simple, typed tokens that say whether a provider is available — no third-party types leaked into route-level code.

Progress summary
----------------
- Step 1 — Add DI token and types: DONE
   - `libs/myid/auth/config/src/lib/oauth/tokens.ts` created. Per-provider boolean tokens and optional metadata tokens exist: `MYID_HAS_GOOGLE`, `MYID_GOOGLE_PROVIDER`, etc.

- Step 2 — Update provider factories: DONE
   - Per-provider factory code in `oath-providers.ts` (and helpers) now contributes availability tokens and builds `SocialAuthServiceConfig` in a `useFactory` guarded by `isPlatformBrowser`.

- Step 3 — Add convenience helper `provideMyIdSocialLogin(options)`: DONE
   - Implemented. See `MyIdOAuth.provideLogins(...)` / `provideMyIdSocialLogin` in `libs/myid/auth/config/src/lib/oauth/oath-providers.ts`.
   - Usage (quick): call `MyIdOAuth.provideLogins({ googleClientId: '...', facebookClientId: '...' })` from `bootstrapApplication()` or `AppModule.providers` to register the `SocialAuthServiceConfig` and per-provider tokens.
 - Step 3 — Add convenience helper `provideMyIdSocialLogin(options)`: DONE
      - Implemented. See `MyIdOAuth.provideLogins(...)` / `provideMyIdSocialLogin` in `libs/myid/auth/config/src/lib/oauth/oath-providers.ts`.
      - Usage (quick): call `MyIdOAuth.provideLogins({ googleClientId: '...', facebookClientId: '...' })` from `bootstrapApplication()` or `AppModule.providers` to register the `SocialAuthServiceConfig` and per-provider tokens.
      - Alternative (recommended): use the fluent `MyIdOAuthBuilder` API for clearer configuration and easier future extension:

```ts
// builder usage (recommended)
import { MyIdOAuthBuilder } from '@spider-baby/myid-auth/config';

providers: [
   ...MyIdOAuthBuilder.create()
      .provideGoogleLogin(environment.oauth.google.client_id)
      .provideFacebookLogin(environment.oauth.faceBook.client_id)
      .buildProviders()
]
```

Migration tip:
- If you currently call `MyIdOAuth.provideLogins(googleId, fbId, amazonId)`, you can migrate by replacing the call with the builder pattern above. The builder produces the same runtime outputs (SSR guard + per-provider tokens), so behavior remains identical.

- Step 4 — Refactor `LoginJwtStateService`: DONE
   - `LoginJwtStateService` now injects the per-provider tokens (optionally) and exposes composed signals: `showGoogleLogin`, `showFacebookLogin`, `showAmazonLogin`, and `canShowSocial`.

- Step 5 — Update `LoginJwtComponent` & templates: DONE
   - Component now reads the state signals and template gates social buttons by per-provider `show*` signals. Social SDK calls are guarded to browser only.

 - Step 6 — Tests: DONE
    - Unit tests added for `oath-providers` verifying token provider registration and `SocialAuthServiceConfig` factory behavior (`oath-providers.spec.ts`).
    - Integration test added that bootstraps an Angular `Injector` with `PLATFORM_ID='browser'` and asserts DI token values and `SocialAuthServiceConfig.providers` (`oath-providers.integration.spec.ts`).
    - Unit tests for `LoginJwtStateService` were added and updated to use Observable-returning mocks; the spec now verifies `show*` signals, `redirectUrl`, login method interactions, and two-factor handling.

 - Step 7 — Docs: PARTIAL -> UPDATED
    - `README.md` received an expanded `Exported Tokens` section with examples and testing notes. Consider a small follow-up to add example snippets showing `bootstrapApplication(...)` wiring in an app README or starter template.

- Step 8 — Backwards compatibility shim: PENDING (optional)
   - Consider a fallback that derives availability from `SocialAuthServiceConfig` when registry tokens are not provided.

Planned implementation for `provideMyIdSocialLogin`
-------------------------------------------------
- Signature: `provideMyIdSocialLogin(options: { googleClientId?: string; facebookClientId?: string; amazonClientId?: string })`
- Returns: an array of providers to add to `bootstrapApplication()` / AppModule providers including:
   - A `SocialAuthServiceConfig` provider built with `useFactory(platformId)` that only constructs third-party provider instances on the browser.
   - Per-provider token providers (e.g., `MYID_HAS_GOOGLE`) using `useFactory(platformId)` that return `true`/`false` or provider metadata.

Key constraints and design notes
--------------------------------
- SSR safety: third-party provider instances are created only inside `useFactory` and only when `isPlatformBrowser(platformId)`.
- Tokens are provided statically at bootstrap and do not change at runtime. If you need runtime toggles, provide a signal/BehaviorSubject instead.
- Tokens currently are booleans + optional provider-def objects. If you switch token shapes later, update the state service accordingly.

Implementation notes / current status
----------------------------------
 - The helper and per-provider token providers are implemented and exported from the package barrel (`libs/myid/auth/config/src/index.ts`). Consumers should import the tokens and helper from the package and call `MyIdOAuth.provideLogins(...)` at app bootstrap.
 - The `LoginJwtStateService` and `LoginJwtComponent` were updated to consume the tokens and expose `show*` signals; social SDK calls are guarded to browser-only.
 - Tests: package-level unit tests (for `oath-providers`) and an integration DI test have been added; `LoginJwtStateService` unit tests and broader e2e smoke tests remain.

Open questions / suggestions to resolve
-------------------------------------
- Token naming & exports: confirm you want the tokens exported from `libs/myid/auth/config/src/index.ts` or kept internal until API stabilizes.
- Metadata tokens: do you want `MYID_GOOGLE_PROVIDER` to include friendly labels (displayName) or just the presence boolean? (Metadata can help UI text.)
- Backwards compatibility: do we need a shim that reads `SocialAuthServiceConfig` when registry tokens are missing (for old integrations)? If so, how important/time-sensitive is this?
- Testing strategy: prefer small unit tests for `LoginJwtStateService` (mock tokens) and a couple of e2e smoke tests. Do you want me to scaffold tests now?
- CI / build checks: do we want to add a step to CI that bootstraps an app with only Google configured and runs headless verification? (Optional, higher effort.)

Additional recommendations (explicit)
-----------------------------------
- Document the tokens in the package README: because these `MYID_*` tokens are now part of the public DI surface, add a short section in `libs/myid/auth/config/README.md` that documents each exported token, its type, and intended use. Call out that consumers should import tokens from `@spider-baby/myid-auth/config`.
- Treat breaking renames as major-version changes: if you ever rename or remove an exported token, treat that as a breaking change and bump the major version. Add a migration note in the README for any token-shape changes.
- Migration note & deprecation period: when changing token shapes (boolean -> object) or names, add a deprecated alias provider for at least one release and document migration steps in the README.
- Tests (concrete): add unit tests for:
   - `LoginJwtStateService`: mock `MYID_HAS_GOOGLE`, `MYID_HAS_FACEBOOK`, `MYID_HAS_AMAZON` token providers and assert `show*` and `canShowSocial` behaviors under different combinations and route `showSocialLinks` values.
   - `provideMyIdSocialLogin`: a unit test that calls the helper with sample client IDs and inspects the returned providers array (or bootstraps a small test injector) to verify the `SocialAuthServiceConfig.providers` content and that per-provider tokens are registered and produce expected values on browser-only factory evaluation.
   - Optional e2e smoke tests: verification scenarios that the social section and per-provider buttons appear/disappear as expected with different configurations.
   - Additional unit tests to add:
     - Verify `LoginJwtStateService.loginGoogle/loginFacebook/loginAmazon/login` actually invoke the corresponding `LoginService` methods (mocked) when triggered.
     - Simulate `PreconditionRequiredError` returned by `LoginService` to assert `twoFactorRequired` becomes true and `twoFactorData` contains the expected two-factor token/provider.

Where to do this work
----------------------
- Add the README documentation and migration notes in `libs/myid/auth/config/README.md`.
- Add unit tests under `libs/myid/auth/config/src/lib/__tests__` (or follow your repo's test layout) and include mocks for `PLATFORM_ID` to simulate server/browser.

Back-compat note
----------------
- You indicated back-compat is not an issue for now (not published yet). We'll keep the optional fallback idea documented for completeness, but we will not implement it unless needed.

Next concrete steps (I can implement these now)
---------------------------------------------
1. Add unit tests for `LoginJwtStateService` to validate `show*` and `canShowSocial` signals against mocked tokens (high priority).
2. Add e2e/smoke tests that verify the social section and per-provider buttons under different configurations.
3. Expand `README.md` with detailed token documentation (types and intended usage) and migration examples.
4. (Optional) Add CI job to run this package's tests in isolation.

Tell me which of the next concrete steps to execute first (I recommend completing `provideMyIdSocialLogin` then adding the tests).

Verification checklist (current state)
------------------------------------
- [x] Social section is hidden if `route.showSocialLinks` is false
- [x] Social section is hidden on server (SSR) even if `route.showSocialLinks` true
- [x] For each configured provider, the corresponding button is visible on browser (when token providers are wired)
- [ ] Clicking a provider button only calls `signIn` when configured; errors are handled gracefully
- [ ] Factory unit tests confirm registry entries and `SocialAuthServiceConfig` providers
- [ ] Login state unit tests confirm computed signals

If you want, I can now finish `provideMyIdSocialLogin` and run a quick TypeScript check. Reply with "Implement now" to proceed, or "Show me code" to preview the implementation before I patch files.

