
/**
 * Names or Keys of claims in JWT
 */
export class MyIdClaimNames{
  
  public static readonly CLAIM_PREFIX = 'myid'
  
  //Registered
  public static NAME = 'name';
  public static EMAIL = 'email';
  public static ISSUER = 'iss';
  public static ISSUED_AT = 'iat';
  public static USER_ID = 'sub';
  public static NOT_VALID_BEFORE = 'nbf';
  public static EXPIRY = 'exp';
  public static AUDIENCE = 'aud';
  public static AUTH_TIME = 'auth_time';
  public static EMAIL_VERIFIED = 'email_verified';  

  //TEAM
  public static TEAM_POSITION = `${this.CLAIM_PREFIX}.team_position`;
  public static TEAM_ID = `${this.CLAIM_PREFIX}.team_id`;
  public static TEAM_TYPE = `${this.CLAIM_PREFIX}.team_type`

  //Devices
  public static CURRENT_DEVICE = `${this.CLAIM_PREFIX}.devices.current_device_id`;
  public static DEVICE_LIMIT = `${this.CLAIM_PREFIX}.devices.device_limit`;

  // public static ROLES_MS = `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`;
  public static ROLE = `role`;

  


} //Cls
