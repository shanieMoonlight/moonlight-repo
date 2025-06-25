import { AppUserDto, TwoFactorProvider } from "../../../../shared/id/io/models";


// export interface IdentityAddressDto {
//   streetAddress?: string;
//   city?: string;
//   state?: string;
//   zipCode?: string;
//   country?: string;
// }

// export interface AppUserDto {
//   id?: string;
//   firstName: string;
//   lastName: string;
//   phoneNumber: string;
//   userName: string;
//   email: string;
//   teamId: string;
//   teamPosition: number;
//   twoFactorProvider: TwoFactorProvider;
//   twoFactorEnabled: boolean;
//   address?: IdentityAddressDto;
// }

export const demoAppUserData: AppUserDto = {
  id: 'usr_123456789',
  firstName: 'Sarah',
  lastName: 'Johnson',
  phoneNumber: '+1-555-123-4567',
  userName: 'sarah.johnson',
  email: 'sarah.johnson@company.com',
  teamId: 'team_dev_001',
  teamPosition: 3,
  twoFactorProvider: 'authenticatorApp',
  twoFactorEnabled: true,
  address: {
    line1: '123 Main Street',
    line2: 'Apt 4B',
    line3: 'Seattle, WA 98101',
    line4: 'United States',
    areaCode: '98101',
    notes: 'Primary residence',
    appUserId: 'usr_123456789'
  }
};

export const demoAppUserDataMinimal: AppUserDto = {
    id: 'usr_001',
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '+1-555-987-6543',
  userName: 'john.doe',
  email: 'john.doe@example.com',
  teamId: 'team_qa_002',
  teamPosition: 1,
  twoFactorProvider: 'sms',
  twoFactorEnabled: false
  // No address provided (optional)
};

export const demoAppUserDataArray: AppUserDto[] = [
  {
    id: 'usr_001',
    firstName: 'Alice',
    lastName: 'Williams',
    phoneNumber: '+1-555-111-2222',
    userName: 'alice.williams',
    email: 'alice.williams@company.com',
    teamId: 'team_design_001',
    teamPosition: 3,
    twoFactorProvider: 'email',
    twoFactorEnabled: true,
    address: {
      line1: '456 Oak Avenue',
      line2: 'Suite 101',
      line3: 'Portland, OR 97201',
      line4: 'United States',
      areaCode: '97201',
      notes: 'Work address',
      appUserId: 'usr_001'
    }
  },
  {
    id: 'usr_002',
    firstName: 'Michael',
    lastName: 'Chen',
    phoneNumber: '+1-555-333-4444',
    userName: 'michael.chen',
    email: 'michael.chen@company.com',
    teamId: 'team_backend_001',
    teamPosition: 1,
    twoFactorProvider: 'authenticatorApp',
    twoFactorEnabled: true,
    address: {
      line1: '789 Pine Street',
      line2: 'Suite 200',
      line3: 'San Francisco, CA 94102',
      line4: 'United States',
      areaCode: '94102',
      notes: 'Corporate headquarters',
      appUserId: 'usr_002'
    }
  },
  {
    id: 'usr_003',
    firstName: 'Emma',
    lastName: 'Rodriguez',
    phoneNumber: '+1-555-555-6666',
    userName: 'emma.rodriguez',
    email: 'emma.rodriguez@company.com',
    teamId: 'team_frontend_001',
    teamPosition: 2,
    twoFactorProvider: 'sms',
    twoFactorEnabled: false
    // No address (testing optional field)
  }
];