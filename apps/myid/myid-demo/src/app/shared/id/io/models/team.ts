import { TeamType } from './team-type';
import { AppUser } from './app-user';
import { TeamSubscription } from './team-subscription';

export interface Team {
  id?: string;
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  name?: string;
  description?: string;
  teamType?: TeamType;
  minPosition?: number;
  maxPosition?: number;
  capacity?: number;
  leaderId?: string;
  leader?: AppUser;
  members?: AppUser[];
  subscriptions?: TeamSubscription[];
}
