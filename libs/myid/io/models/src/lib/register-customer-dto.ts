export interface RegisterCustomerDto {
  firstName?: string;
  lastName?: string;
  username?: string;
  email: string;
  phoneNumber?: string;
  subscriptionPlanId?: string;
  teamPosition?: number;
  password: string;
  confirmPassword: string;
}
