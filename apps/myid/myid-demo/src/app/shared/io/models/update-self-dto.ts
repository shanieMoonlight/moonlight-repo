import { TwoFactorProviderNullable } from './two-factor-provider-nullable';

export interface UpdateSelfDto {
  id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  twoFactorProvider?: TwoFactorProviderNullable;
  twoFactorEnabled?: boolean;
  teamId?: string;
}
