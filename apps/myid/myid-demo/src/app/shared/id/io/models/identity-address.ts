import { AppUser } from './app-user';

export interface IdentityAddress {
  line1: string;
  line2: string;
  line3?: string;
  line4?: string;
  line5?: string;
  areaCode?: string;
  notes?: string;
  appUserId?: string;
  appUser?: AppUser;
}
