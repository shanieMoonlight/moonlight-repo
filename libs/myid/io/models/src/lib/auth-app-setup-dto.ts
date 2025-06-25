export interface AuthAppSetupDto {
  customerSecretKey?: string;
  twoFactorSetupKey?: string;
  qrCodeImageData?: string;
  account?: string;
}
