import { SubscriptionRenewalTypes } from './subscription-renewal-types';
import { FeatureFlagDto } from './feature-flag-dto';

export interface SubscriptionPlanDto {
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  id?: string;
  name?: string;
  description?: string;
  renewalType?: SubscriptionRenewalTypes;
  price?: number;
  deviceLimit?: number;
  trialMonths?: number;
  featureFlags?: FeatureFlagDto[];
  featureFlagIds?: string[];
}
