// Auto-generated from Swagger schemas

export interface AddCustomerMemberDto {
  firstName?: string;
  lastName?: string;
  username?: string;
  email: string;
  phoneNumber?: string;
  teamPosition?: number;
}

export interface AddCustomerMember_MntcDto {
  firstName?: string;
  lastName?: string;
  username?: string;
  email: string;
  phoneNumber?: string;
  teamPosition?: number;
  teamId?: string;
}

export interface AddDeviceToTeamDto {
  subscriptionId?: string;
  name?: string;
  description?: string;
  uniqueId?: string;
}

export interface AddFeatureToPlanDto {
  subscriptionPlanId?: string;
  featureId?: string;
}

export interface AddFeaturesToPlanDto {
  subscriptionPlanId?: string;
  featureIds?: string[];
}

export interface AddMntcMemberDto {
  firstName?: string;
  lastName?: string;
  username?: string;
  email: string;
  phoneNumber?: string;
  teamPosition?: number;
}

export interface AddSprMemberDto {
  firstName?: string;
  lastName?: string;
  username?: string;
  email: string;
  phoneNumber?: string;
  teamPosition?: number;
}

export interface AddTeamSubscriptionDto {
  teamId?: string;
  subscriptionPlanId?: string;
  discount?: number;
}

export interface AppUser {
  id?: string;
  userName?: string;
  normalizedUserName?: string;
  email?: string;
  normalizedEmail?: string;
  emailConfirmed?: boolean;
  passwordHash?: string;
  securityStamp?: string;
  concurrencyStamp?: string;
  phoneNumber?: string;
  phoneNumberConfirmed?: boolean;
  twoFactorEnabled?: boolean;
  lockoutEnd?: string;
  lockoutEnabled?: boolean;
  accessFailedCount?: number;
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  firstName?: string;
  lastName?: string;
  address?: IdentityAddress;
  avatar?: Avatar;
  teamId?: string;
  team?: Team;
  teamPosition?: number;
  tkn?: string;
  tknModifiedDate?: string;
  twoFactorProvider?: TwoFactorProvider;
  twoFactorKey?: string;
  oAuthInfo?: OAuthInfo;
  friendlyName?: string;
}

export interface AppUserDto {
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  userName?: string;
  email?: string;
  teamId?: string;
  teamPosition?: number;
  twoFactorProvider?: TwoFactorProvider;
  twoFactorEnabled?: boolean;
  emailConfirmed?: boolean;
  address?: IdentityAddressDto;
}

export interface AppUserDtoPagedResponse {
  data?: AppUserDto[];
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
  totalItems?: number;
  nextPageRequest?: PagedRequest;
  previousPageRequest?: PagedRequest;
}

export interface AppUser_Customer_Dto {
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  userName?: string;
  email?: string;
  teamId?: string;
  teamPosition?: number;
  twoFactorProvider?: TwoFactorProvider;
  twoFactorEnabled?: boolean;
  emailConfirmed?: boolean;
  address?: IdentityAddressDto;
}

export interface AppUser_Customer_DtoPagedResponse {
  data?: AppUser_Customer_Dto[];
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
  totalItems?: number;
  nextPageRequest?: PagedRequest;
  previousPageRequest?: PagedRequest;
}

export interface AuthAppSetupDto {
  customerSecretKey?: string;
  twoFactorSetupKey?: string;
  qrCodeImageData?: string;
  account?: string;
}

export interface Avatar {
  id?: string;
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  srcType?: ImageSrcTypes;
  b64?: string;
  url?: string;
}

export interface ChPwdDto {
  userId?: string;
  username?: string;
  email?: string;
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ConfirmEmailDto {
  userId?: string;
  confirmationToken?: string;
}

export interface ConfirmEmailWithPwdDto {
  userId?: string;
  confirmationToken?: string;
  password?: string;
  confirmPassword?: string;
}

export interface ConfirmPhoneDto {
  confirmationToken?: string;
}

export interface DeviceDto {
  id?: string;
  name?: string;
  description?: string;
  uniqueId?: string;
  subscriptionId?: string;
}

export interface FeatureFlag {
  id?: string;
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  name?: string;
  description?: string;
  subscriptionPlans?: SubscriptionPlan[];
  subscriptionPlanFeatures?: SubscriptionPlanFeature[];
}

export interface FeatureFlagDto {
  id?: string;
  name?: string;
  description?: string;
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
}

export interface FeatureFlagDtoPagedResponse {
  data?: FeatureFlagDto[];
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
  totalItems?: number;
  nextPageRequest?: PagedRequest;
  previousPageRequest?: PagedRequest;
}

export interface FilterRequest {
  field?: string;
  filterType?: string;
  filterValue?: string;
  filterValues?: string[];
  filterDataType?: string;
}

export interface ForgotPwdDto {
  userId?: string;
  username?: string;
  email?: string;
}

export interface GoogleSignInDto {
  idToken?: string;
  subscriptionId?: string;
  deviceId?: string;
}

export interface IdOutboxMessageDto {
  id?: string;
  type?: string;
  contentJson?: string;
  createdOnUtc?: string;
  processedOnUtc?: string;
  error?: string;
}

export interface IdOutboxMessageDtoPagedResponse {
  data?: IdOutboxMessageDto[];
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
  totalItems?: number;
  nextPageRequest?: PagedRequest;
  previousPageRequest?: PagedRequest;
}

export interface IdentityAddress {
  line1: string;
  line2: string;
  line3?: string;
  line4?: string;
  line5?: string;
  areaCode?: string;
  notes?: string;
  appUserId?: string;
  appUser?: AppUser;
}

export interface IdentityAddressDto {
  line1?: string;
  line2?: string;
  line3?: string;
  line4?: string;
  line5?: string;
  areaCode?: string;
  notes?: string;
  appUserId?: string;
}

export type ImageSrcTypes = 1 | 2;

export interface InitializeDto {
  password?: string;
  email?: string;
}

export interface JwtPackage {
  accessToken?: string;
  refreshToken?: string;
  expiration?: number;
  twoStepVerificationRequired?: boolean;
  twoFactorProvider?: TwoFactorProvider;
  extraInfo?: string;
  expirationDate?: string;
}

export interface LoginDto {
  userId?: string;
  username?: string;
  email?: string;
  password: string;
  deviceId?: string;
}

export interface LoginRefreshDto {
  resetToken: string;
  deviceId?: string;
}

export interface MessageResponseDto {
  message?: string;
}

export interface OAuthInfo {
  id?: string;
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  issuer?: string;
  imageUrl?: string;
  emailVerified?: boolean;
  provider?: OAuthProvider;
  appUserId?: string;
  appUser?: AppUser;
}

export type OAuthProvider = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80;

export interface PagedRequest {
  pageNumber?: number;
  pageSize?: number;
  filterList?: FilterRequest[];
  sortList?: SortRequest[];
}

export interface RecordSubscriptionPaymentDto {
  teamId?: string;
  subscriptionId?: string;
}

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

export interface RegisterCustomer_NoPwdDto {
  firstName?: string;
  lastName?: string;
  username?: string;
  email: string;
  phone?: string;
  subscriptionPlanId?: string;
  teamPosition?: number;
}

export interface RemoveDeviceFromTeamSubscriptionDto {
  subscriptionId?: string;
  deviceId?: string;
}

export interface RemoveFeatureFromSubscriptionPlanDto {
  subscriptionPlanId?: string;
  featureId?: string;
}

export interface RemoveFeaturesFromSubscriptionPlanDto {
  subscriptionPlanId?: string;
  featureIds?: string[];
}

export interface RemoveTeamSubscriptionDto {
  teamId?: string;
  subscriptionId?: string;
}

export interface Resend2FactorDto {
  userId?: string;
  username?: string;
  email?: string;
}

export interface ResendEmailConfirmationDto {
  userId?: string;
  username?: string;
  email?: string;
}

export interface ResendPhoneConfirmationDto {
  userId?: string;
  username?: string;
  email?: string;
}

export interface ResetPwdDto {
  userId?: string;
  username?: string;
  email?: string;
  newPassword: string;
  confirmPassword: string;
  resetToken: string;
}

export interface SignInDto {
  userId?: string;
  username?: string;
  email?: string;
  password: string;
  deviceId?: string;
  rememberMe?: boolean;
}

export interface SortRequest {
  field?: string;
  sortDescending?: boolean;
}

export interface SubscriptionDto {
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  id?: string;
  subscriptionPlanId?: string;
  subscriptionPlan?: SubscriptionPlanDto;
  subscriptionStatus?: SubscriptionStatus;
  discount?: number;
  startDate?: string;
  endDate?: string;
  trialStartDate?: string;
  trialEndDate?: string;
  lastPaymentDate?: string;
  lastPaymenAmount?: number;
  teamId?: string;
  team?: Team;
  devices?: DeviceDto[];
  name?: string;
  description?: string;
  trial?: boolean;
  renewalType?: SubscriptionRenewalTypesNullable;
}

export interface SubscriptionPlan {
  id?: string;
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  name?: string;
  description?: string;
  renewalType?: SubscriptionRenewalTypes;
  deviceLimit?: number;
  trialMonths?: number;
  price?: number;
  featureFlags?: FeatureFlag[];
  subscriptions?: TeamSubscription[];
  subscriptionPlanFeatures?: SubscriptionPlanFeature[];
}

export interface SubscriptionPlanDto {
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  id?: string;
  name?: string;
  description?: string;
  renewalType?: SubscriptionRenewalTypes;
  price?: number;
  deviceLimit?: number;
  trialMonths?: number;
  featureFlags?: FeatureFlagDto[];
  featureFlagIds?: string[];
}

export interface SubscriptionPlanDtoPagedResponse {
  data?: SubscriptionPlanDto[];
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
  totalItems?: number;
  nextPageRequest?: PagedRequest;
  previousPageRequest?: PagedRequest;
}

export interface SubscriptionPlanFeature {
  subscriptionPlanId?: string;
  subscriptionPlan?: SubscriptionPlan;
  featureFlagId?: string;
  featureFlag?: FeatureFlag;
}

export type SubscriptionRenewalTypes = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type SubscriptionRenewalTypesNullable = 1 | 2 | 3 | 4 | 5 | 6 | 7 | null;

export type SubscriptionStatus = 1 | 2 | 3 | 4;

export interface Team {
  id?: string;
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  name?: string;
  description?: string;
  teamType?: TeamType;
  minPosition?: number;
  maxPosition?: number;
  capacity?: number;
  leaderId?: string;
  leader?: AppUser;
  members?: AppUser[];
  subscriptions?: TeamSubscription[];
}

export interface TeamDevice {
  id?: string;
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  name?: string;
  description?: string;
  uniqueId?: string;
  subscriptionId?: string;
  subscription?: TeamSubscription;
}

export interface TeamDto {
  id?: string;
  name?: string;
  description?: string;
  minPosition?: number;
  maxPosition?: number;
  leaderId?: string;
  leader?: AppUserDto;
  members?: AppUserDto[];
  teamType?: TeamType;
}

export interface TeamDtoPagedResponse {
  data?: TeamDto[];
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
  totalItems?: number;
  nextPageRequest?: PagedRequest;
  previousPageRequest?: PagedRequest;
}

export interface TeamSubscription {
  id?: string;
  administratorUsername?: string;
  administratorId?: string;
  dateCreated?: string;
  lastModifiedDate?: string;
  subscriptionStatus?: SubscriptionStatus;
  discount?: number;
  startDate?: string;
  endDate?: string;
  trialStartDate?: string;
  trialEndDate?: string;
  lastPaymentDate?: string;
  lastPaymenAmount?: number;
  deviceLimit?: number;
  devices?: TeamDevice[];
  teamId?: string;
  team?: Team;
  subscriptionPlanId?: string;
  subscriptionPlan?: SubscriptionPlan;
  renewalType?: SubscriptionRenewalTypes;
  expired?: boolean;
  trial?: boolean;
  name?: string;
  description?: string;
}

export type TeamType = 1 | 2 | 3;

export interface TwoFactorAuthAppCompleteRegDto {
  twoFactorCode?: string;
  customerSecretKey?: string;
}

export type TwoFactorProvider = 1 | 2 | 3;

export type TwoFactorProviderNullable = 1 | 2 | 3 | null;

export interface UpdateSelfDto {
  id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  twoFactorProvider?: TwoFactorProviderNullable;
  twoFactorEnabled?: boolean;
  teamId?: string;
}

export interface UpdateTeamLeaderDto {
  newLeaderId?: string;
  teamId?: string;
}

export interface UpdateTeamPositionRangeDto {
  minPosition?: number;
  maxPosition?: number;
}

export interface Verify2FactorDto {
  token: string;
  deviceId?: string;
}

