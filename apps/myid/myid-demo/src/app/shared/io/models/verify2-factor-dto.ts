export interface Verify2FactorDto {
  code: string;
  deviceId?: string;
  userId: string;
}
