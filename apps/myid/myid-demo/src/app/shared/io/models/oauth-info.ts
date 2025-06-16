import { OAuthProvider } from './oauth-provider';
import { AppUser } from './app-user';

export interface OAuthInfo {
  id?: string;
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  issuer?: string;
  imageUrl?: string;
  emailVerified?: boolean;
  provider?: OAuthProvider;
  appUserId?: string;
  appUser?: AppUser;
}
