import { SelectOption } from "../../ui/select/select.component";

export const twoFactorProviderOptions: SelectOption[] = [
    { value: 'authenticatorApp', label: 'Authenticator App' },
    { value: 'sms', label: 'SMS' },
    { value: 'email', label: 'Email' }
]