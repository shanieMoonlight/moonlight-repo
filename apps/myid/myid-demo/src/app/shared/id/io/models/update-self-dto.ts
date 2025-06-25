import { TwoFactorProvider } from './two-factor-provider';

export interface UpdateSelfDto {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email: string;
  phoneNumber: string;
  twoFactorProvider?: TwoFactorProvider
  twoFactorEnabled?: boolean;
  teamId: string;
}
