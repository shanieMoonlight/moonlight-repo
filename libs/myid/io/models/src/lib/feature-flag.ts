import { SubscriptionPlan } from './subscription-plan';
import { SubscriptionPlanFeature } from './subscription-plan-feature';

export interface FeatureFlag {
  id?: string;
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  name?: string;
  description?: string;
  subscriptionPlans?: SubscriptionPlan[];
  subscriptionPlanFeatures?: SubscriptionPlanFeature[];
}
