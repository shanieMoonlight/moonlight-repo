import { TwoFactorProvider } from './two-factor-provider';

export interface CookieSignInResultData {
  succeeded?: boolean;
  emailConfirmationRequired?: boolean;
  twoFactorRequired?: boolean;
  twoFactorProvider?: TwoFactorProvider;
  message?: string;
  extraInfo?: string;
}
