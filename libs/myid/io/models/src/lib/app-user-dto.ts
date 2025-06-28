import { TwoFactorProvider } from './two-factor-provider';
import { IdentityAddressDto } from './identity-address-dto';

export interface AppUserDto {
  id: string;
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userName: string;
  email: string;
  teamId: string;
  teamPosition: number;
  twoFactorProvider: TwoFactorProvider;
  twoFactorEnabled: boolean;
  emailConfirmed?: boolean;
  address?: IdentityAddressDto;
}
