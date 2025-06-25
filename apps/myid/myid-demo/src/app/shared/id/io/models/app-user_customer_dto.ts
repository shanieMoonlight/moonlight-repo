import { TwoFactorProvider } from './two-factor-provider';
import { IdentityAddressDto } from './identity-address-dto';

export interface AppUser_Customer_Dto {
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  userName?: string;
  email?: string;
  teamId?: string;
  teamPosition?: number;
  twoFactorProvider?: TwoFactorProvider;
  twoFactorEnabled?: boolean;
  emailConfirmed?: boolean;
  address?: IdentityAddressDto;
}
