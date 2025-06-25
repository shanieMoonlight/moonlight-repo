export interface Verify2FactorDto {
  code: string;
  deviceId?: string;
  token: string;
}
