import { TwoFactorProvider } from './two-factor-provider';

export interface JwtPackage {
  accessToken: string;
  refreshToken?: string;
  expiration?: number;
  twoFactorVerificationRequired?: boolean;
  twoFactorProvider?: TwoFactorProvider;
  twoFactorToken?: string;
  extraInfo?: string;
  expirationDate?: string;
}
