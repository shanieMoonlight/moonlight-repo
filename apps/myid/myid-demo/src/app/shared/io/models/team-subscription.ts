import { SubscriptionStatus } from './subscription-status';
import { TeamDevice } from './team-device';
import { Team } from './team';
import { SubscriptionPlan } from './subscription-plan';
import { SubscriptionRenewalTypes } from './subscription-renewal-types';

export interface TeamSubscription {
  id?: string;
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  subscriptionStatus?: SubscriptionStatus;
  discount?: number;
  startDate?: string;
  endDate?: string;
  trialStartDate?: string;
  trialEndDate?: string;
  lastPaymentDate?: string;
  lastPaymenAmount?: number;
  deviceLimit?: number;
  devices?: TeamDevice[];
  teamId?: string;
  team?: Team;
  subscriptionPlanId?: string;
  subscriptionPlan?: SubscriptionPlan;
  renewalType?: SubscriptionRenewalTypes;
  expired?: boolean;
  trial?: boolean;
  name?: string;
  description?: string;
}
