# Phone Format Provider

This folder contains the provider pattern for formatting phone numbers in the MyID UI forms.

## Purpose
- Centralizes phone number formatting logic for use in forms and services.
- Allows easy extension or override of phone formatting via Angular Dependency Injection.

## Default Behavior
- The abstract class `MyIdPhoneFormatProvider` defines the contract for phone format providers.
- The default implementation, `FallbackPhoneFormatProvider`, uses `libphonenumber-js` to format phone numbers to international standard (e.g., for Twilio).
- The default country code is provided by `DefaultPhoneCodeProvider` and can be customized via the `DEFAULT_PHONE_CODE` injection token.

## Customization
To change the phone formatting logic, provide your own implementation of `MyIdPhoneFormatProvider` at the app, module, or route level.

### Example: Custom Provider
```typescript
@Injectable({ providedIn: 'root' })
export class CustomPhoneFormatProvider extends MyIdPhoneFormatProvider {
  override formatPhoneInternational(phone: string): string {
    // Custom formatting logic here
    return phone.replace(/[^\d+]/g, '');
  }
}
```

### Example: Providing in a Route
```typescript
{
  path: 'custom-phone',
  component: CustomComponent,
  providers: [
    { provide: MyIdPhoneFormatProvider, useClass: CustomPhoneFormatProvider }
  ]
}
```

## Best Practices
- Use this pattern to keep formatting logic out of your form components.
- Always return a string in international format if possible.
- For dynamic or async formatting, consider returning an Observable and using the async pipe in your template.

## File Overview
- `phone-format-provider.ts`: Contains the abstract provider, default implementation, and related tokens/providers.

---

_This pattern makes your phone formatting logic more maintainable, testable, and extensible._
