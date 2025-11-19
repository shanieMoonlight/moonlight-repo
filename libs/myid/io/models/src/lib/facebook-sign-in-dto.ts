export interface FacebookSignInDto {
  id: string;
  authToken: string;
  email?: string;
  subscriptionPlanId?: string;
  deviceId?: string;
}
