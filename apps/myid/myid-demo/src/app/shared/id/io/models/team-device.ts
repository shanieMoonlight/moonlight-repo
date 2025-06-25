import { TeamSubscription } from './team-subscription';

export interface TeamDevice {
  id?: string;
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  name?: string;
  description?: string;
  uniqueId?: string;
  subscriptionId?: string;
  subscription?: TeamSubscription;
}
