import { TwoFactorProvider } from './two-factor-provider';

export interface JwtPackage {
  accessToken?: string;
  refreshToken?: string;
  expiration?: number;
  twoStepVerificationRequired?: boolean;
  twoFactorProvider?: TwoFactorProvider;
  extraInfo?: string;
  expirationDate?: string;
}
