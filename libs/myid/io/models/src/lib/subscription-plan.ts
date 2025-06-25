import { SubscriptionRenewalTypes } from './subscription-renewal-types';
import { FeatureFlag } from './feature-flag';
import { TeamSubscription } from './team-subscription';
import { SubscriptionPlanFeature } from './subscription-plan-feature';

export interface SubscriptionPlan {
  id?: string;
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  name?: string;
  description?: string;
  renewalType?: SubscriptionRenewalTypes;
  deviceLimit?: number;
  trialMonths?: number;
  price?: number;
  featureFlags?: FeatureFlag[];
  subscriptions?: TeamSubscription[];
  subscriptionPlanFeatures?: SubscriptionPlanFeature[];
}
