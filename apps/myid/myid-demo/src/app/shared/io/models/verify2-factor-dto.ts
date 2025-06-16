export interface Verify2FactorDto {
  token: string;
  deviceId?: string;
  userId?: string;
}
