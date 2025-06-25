export interface ResetPwdDto {
  userId?: string;
  username?: string;
  email?: string;
  newPassword: string;
  confirmPassword: string;
  resetToken: string;
}
