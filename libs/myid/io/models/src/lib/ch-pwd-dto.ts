export interface ChPwdDto {
  userId?: string;
  username?: string;
  email?: string;
  password: string;
  newPassword: string;
  confirmPassword: string;
}
