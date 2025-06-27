import { SelectOption } from "@spider-baby/ui-kit/select";

export const twoFactorProviderOptions: SelectOption[] = [
    { value: 'authenticatorApp', label: 'Authenticator App' },
    { value: 'sms', label: 'SMS' },
    { value: 'email', label: 'Email' }
]