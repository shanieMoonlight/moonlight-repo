# Two Factor Options Provider

This folder contains the provider pattern for supplying two-factor authentication options to forms in the MyID UI.

## Purpose
- Centralizes the definition and retrieval of two-factor authentication options (e.g., Authenticator App, SMS, Email).
- Allows easy extension or override of available options via Angular Dependency Injection.

## Default Behavior
- The abstract class `MyIdTwoFactorOptionsProvider` defines the contract for option providers.
- The default implementation, `FallbackTwoFactorOptionsProvider`, returns a static list of options (`Authenticator App`, `SMS`, `Email`).
- By default, all forms using this provider will get the fallback options.

## Customization
To change the available options, provide your own implementation of `MyIdTwoFactorOptionsProvider` at the app, module, or route level.

### Example: Custom Provider
```typescript
@Injectable({ providedIn: 'root' })
export class CustomTwoFactorOptionsProvider extends MyIdTwoFactorOptionsProvider {
  override getOptions(): TwoFactorOption[] {
    return [
      { value: 'AuthenticatorApp', label: 'Authenticator App' },
      { value: 'Push', label: 'Push Notification' },
      // ...other custom options
    ];
  }
}
```

### Example: Providing in a Route
```typescript
{
  path: 'custom-two-factor',
  component: CustomComponent,
  providers: [
    { provide: MyIdTwoFactorOptionsProvider, useClass: CustomTwoFactorOptionsProvider }
  ]
}
```

## Best Practices
- Use this pattern to keep option logic out of your form components.
- Always provide a strongly-typed array of `TwoFactorOption`.
- For dynamic or async options, consider returning an Observable and using the async pipe in your template.

## File Overview
- `two-factor-options-provider.ts`: Contains the abstract provider, default implementation, and option interface.

---

_This pattern makes your forms more maintainable, testable, and extensible._
