import { SubscriptionPlan } from './subscription-plan';
import { FeatureFlag } from './feature-flag';

export interface SubscriptionPlanFeature {
  subscriptionPlanId?: string;
  subscriptionPlan?: SubscriptionPlan;
  featureFlagId?: string;
  featureFlag?: FeatureFlag;
}
