
/**
 * Names or Keys of claims in JWT
 */
export class MyIdClaimNames{

  
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
  
  public static readonly CLAIM_PREFIX = 'myid'

  //TEAM
  public static TEAM_POSITION = `${this.CLAIM_PREFIX}.team_position`;
  public static TEAM_ID = `${this.CLAIM_PREFIX}.team_id`;
  public static TEAM_TYPE = `${this.CLAIM_PREFIX}.team_type`

  //2FA
  public static TWO_FACTOR_VERIFIED = `${this.CLAIM_PREFIX}.two_factor_verified`;
  public static TWO_FACTOR_REQUIRED = `${this.CLAIM_PREFIX}.two_factor_required`;

  //Devices
  public static CURRENT_DEVICE = `${this.CLAIM_PREFIX}.devices.CurrentDeviceId`;
  public static DEVICES = `${this.CLAIM_PREFIX}.devices.DeviceList`;
  public static DEVICE_LIMIT = `${this.CLAIM_PREFIX}.devices.devicelimit`;

  // public static ROLES_MS = `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`;
  public static ROLE = `${this.CLAIM_PREFIX}.role`;

  
  //User
  public static FIRST_NAME = `${this.CLAIM_PREFIX}.firstName`;
  public static LAST_NAME =   `${this.CLAIM_PREFIX}.lastName`;

  public static SUBCRIPTIONS = `${this.CLAIM_PREFIX}.subscriptions`;

} //Cls
