export interface Verify2FactorCookieDto {
  token: string;
  deviceId?: string;
  userId?: string;
  rememberMe?: boolean;
}
