export interface ConfirmEmailWithPwdDto {
  userId?: string;
  confirmationToken?: string;
  password: string;
  confirmPassword: string;
}
