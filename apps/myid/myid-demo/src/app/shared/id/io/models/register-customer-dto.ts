export interface RegisterCustomerDto {
  firstName?: string;
  lastName?: string;
  username?: string;
  email: string;
  phone?: string;
  subscriptionPlanId?: string;
  teamPosition?: number;
  password: string;
  confirmPassword: string;
}
