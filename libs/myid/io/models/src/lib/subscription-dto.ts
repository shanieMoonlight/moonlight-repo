import { DeviceDto } from './device-dto';
import { SubscriptionPlanDto } from './subscription-plan-dto';
import { SubscriptionRenewalTypes } from './subscription-renewal-types';
import { SubscriptionStatus } from './subscription-status';
import { TeamDto } from './team-dto';

export interface SubscriptionDto {
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  id?: string;
  subscriptionPlanId?: string;
  subscriptionPlan?: SubscriptionPlanDto;
  subscriptionStatus?: SubscriptionStatus;
  discount?: number;
  startDate?: string;
  endDate?: string;
  trialStartDate?: string;
  trialEndDate?: string;
  lastPaymentDate?: string;
  lastPaymenAmount?: number;
  teamId?: string;
  team?: TeamDto;
  devices?: DeviceDto[];
  name?: string;
  description?: string;
  trial?: boolean;
  renewalType: SubscriptionRenewalTypes;
}
