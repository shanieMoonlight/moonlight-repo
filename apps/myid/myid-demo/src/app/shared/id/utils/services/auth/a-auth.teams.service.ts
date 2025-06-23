import { computed, Directive } from '@angular/core';
import { MyIdClaimNames } from './claim-names';
import { BaseAuthSignalService } from './base-auth.signal.service';
import { TeamPositionInfo } from '../../team-position-info';
import { StringHelpers } from '../../dates/string-helpers';
import { Claim } from './claim';


@Directive({})
export abstract class AAuthTeamRolesService extends BaseAuthSignalService {


  roles$ = computed(() => this.extractRoleValues(this.allClaimsRecord$()));
  devices$ = computed(() => this.parseDeviceListClaims(this.allClaimsRecord$()));
  subscriptions$ = computed(() => this.parseSubscriptionClaims(this.allClaimsRecord$()));
  deviceLimit$ = computed(() => this.getClaimValue(MyIdClaimNames.DEVICE_LIMIT));

  twoFactorRequired$ = computed(() => !!this.hasClaimType(MyIdClaimNames.TWO_FACTOR_REQUIRED));
  twoFactorVerified$ = computed(() => !!this.getClaimValue(MyIdClaimNames.TWO_FACTOR_VERIFIED));

  twoFactorValid$ = computed(() => !this.twoFactorRequired$() || this.twoFactorVerified$());

  /**Auth Token exists but may be out of date or MFA not completed */
  isAuthenticated$ = computed(() => !!this.decodedToken$())

  firstName$ = computed(() => this.getClaimValue(MyIdClaimNames.FIRST_NAME));
  lastName$ = computed(() => this.getClaimValue(MyIdClaimNames.LAST_NAME));

  //---------------------TEAMS ---------------------//

  isSpr$ = computed(() => !!this.isLoggedIn$() && !!this.hasClaim(TeamClaims.SuperTeam));
  isMntc$ = computed(() => !!this.isLoggedIn$() && !!this.hasClaim(TeamClaims.MntcTeam));
  isCus$ = computed(() => !!this.isLoggedIn$() && !!this.hasClaim(TeamClaims.CustomerTeam));

  //--------------- POSITION IN TEAM ---------------//

  isLdr$ = computed(() => !!this.isLoggedIn$() && !!this.roles$().has(TeamClaims.Leader.value));

  isAdmin$ = computed(() => !!this.isLoggedIn$() && !!this.hasPosition(TeamPositions.ADMIN));
  isMgr$ = computed(() => !!this.isLoggedIn$() && !!this.hasPosition(TeamPositions.MGR));
  isUser$ = computed(() => !!this.isLoggedIn$() && !!this.hasPosition(TeamPositions.USER));
  isGuest$ = computed(() => !!this.isLoggedIn$() && !!this.hasPosition(TeamPositions.GUEST));

  teamId$ = computed(() => this.getClaimValue(MyIdClaimNames.TEAM_ID) ?? '');
  position$ = computed(() => {
    const posStr = this.getClaimValue(MyIdClaimNames.TEAM_POSITION);
    const posNum = Number(posStr);
    return Number.isNaN(posNum) ? -1 : posNum;
  });

  //------------------ SUPER TEAM ------------------//

  isSprLdr$ = computed(() => this.isSpr$() && this.isLdr$());

  isSprAdmin$ = computed(() => this.isSpr$() && this.isAdmin$());
  isSprMgr$ = computed(() => this.isSpr$() && this.isMgr$());
  isSprUser$ = computed(() => this.isSpr$() && this.isUser$());
  isSprGuest$ = computed(() => this.isSpr$() && this.isGuest$());

  //----------------- MAINTENANCE TEAM --------------//

  isMntcLdr$ = computed(() => this.isMntc$() && this.isLdr$());

  isMntcAdmin$ = computed(() => this.isMntc$() && this.isAdmin$());
  isMntcMgr$ = computed(() => this.isMntc$() && this.isMgr$());
  isMntcUser$ = computed(() => this.isMntc$() && this.isUser$());
  isMntcGuest$ = computed(() => this.isMntc$() && this.isGuest$());

  //---------------- CUSTOMER TEAM -----------------//

  isCusLdr$ = computed(() => this.isCus$() && this.isLdr$());

  isCusAdmin$ = computed(() => this.isCus$() && this.isAdmin$());
  isCusMgr$ = computed(() => this.isCus$() && this.isMgr$());
  isCusUser$ = computed(() => this.isCus$() && this.isUser$());
  isCusGuest$ = computed(() => this.isCus$() && this.isGuest$());

  //---------------------------------//
  //------------ Minimums -----------//
  //---------------------------------//

  isSprLdrMinimum$ = computed(() => this.isSprLdr$());
  isSprAdminMinimum$ = computed(() => this.isSprAdmin$() || this.isSprLdrMinimum$());
  isSprMgrMinimum$ = computed(() => this.isSprMgr$() || this.isSprAdminMinimum$());
  isSprUserMinimum$ = computed(() => this.isSprUser$() || this.isSprMgrMinimum$());
  isSprGuestMinimum$ = computed(() => this.isSprGuest$() || this.isSprMgrMinimum$());
  isSprMinimum$ = computed(() => this.isSprUserMinimum$());

  //- - - - - - - - - - - - - - - - -//

  isMntcLdrMinimum$ = computed(() => this.isMntcLdr$() || this.isSprMinimum$());
  isMntcAdminMinimum$ = computed(() => this.isMntcAdmin$() || this.isMntcLdrMinimum$());
  isMntcMgrMinimum$ = computed(() => this.isMntcMgr$() || this.isMntcAdminMinimum$());
  isMntcUserMinimum$ = computed(() => this.isMntcUser$() || this.isMntcMgrMinimum$());
  isMntcGstMinimum$ = computed(() => this.isMntcGuest$() || this.isMntcUserMinimum$());
  isMntcMinimum$ = computed(() => this.isMntcGstMinimum$());

  //- - - - - - - - - - - - -//

  isCusLdrMinimum$ = computed(() => this.isCusLdr$() || this.isMntcMinimum$());
  isCusAdminMinimum$ = computed(() => this.isCusAdmin$() || this.isCusLdrMinimum$());
  isCusMgrMinimum$ = computed(() => this.isCusMgr$() || this.isCusAdminMinimum$());
  isCusUserMinimum$ = computed(() => this.isCusUser$() || this.isCusMgrMinimum$());
  isCusGstMinimum$ = computed(() => this.isCusGuest$() || this.isCusUserMinimum$());
  isCusMinimum$ = computed(() => this.isCusGstMinimum$());

  //---------------------------------//
  //------------  DevMode -----------//
  //---------------------------------//

  isMntcOrDev$ = computed(() => this.isInDevMode$() || this.isMntc$());
  isMntcMinimumOrDev$ = computed(() => this.isInDevMode$() || this.isMntcMinimum$());
  isSuperOrDev$ = computed(() => this.isInDevMode$() || this.isSpr$());
  isSuperMinimumOrDev$ = computed(() => this.isInDevMode$() || this.isSprMinimum$());

  //---------------------------------//

  constructor(
    storedToken?:
      | (string | null | undefined)
      | Promise<string | null | undefined>
  ) {
    super(storedToken);
  }

  //---------------------------------//

  /**Read in the roles stored in the JWT */
  private extractRoleValues(allClaimsRecord: Record<string, Claim>): Set<string> {
    console.log('extractRoleValues', allClaimsRecord);
    try {
      //TODO get roles from const in class
      if (!allClaimsRecord) return new Set<string>();

      const claimValues = allClaimsRecord?.[TeamRoleNames.KEY]?.value;
      if (Array.isArray(claimValues)) return new Set<string>(claimValues);
      else return new Set<string>([claimValues]);
    } catch (error) {
      console.log(error);
      this.logError(error);
      this.logOut();

      return new Set<string>();
    }
  }
  //---------------------------------//

  private parseSubscriptionClaims(allClaimsRecord: Record<string, Claim>): JwtSubscription[] {

    try {
      const subs: JwtSubscription[] = [];
      const subsValue = allClaimsRecord[MyIdClaimNames.SUBCRIPTIONS]?.value;

      //It might not appear as an array if there is only one app.
      if (subsValue instanceof Array)
        subs.push(...subsValue as JwtSubscription[])
      else if (StringHelpers.IsString(subsValue))
        subs.push(JSON.parse(subsValue.toString()))
      else
        subs.push(subsValue as JwtSubscription)

      return subs;
    } catch (error: any) {
      error.claims = allClaimsRecord;
      this.logError(error);
      return [];
    }
  }

  //---------------------------------//

  private parseDeviceListClaims(allClaimsRecord: Record<string, Claim>): Device[] {

    console.log('parseDeviceListClaims', allClaimsRecord);
    try {
      const devices: Device[] = [];
      const dvcListClaimsValue = allClaimsRecord[MyIdClaimNames.DEVICES]?.value;

      //It might not appear as an array if there is only one app.
      if (StringHelpers.isString(dvcListClaimsValue))
        devices.push(JSON.parse(dvcListClaimsValue.toString()));
      else if (dvcListClaimsValue instanceof Array)
        dvcListClaimsValue.forEach((cs: string) =>
          devices.push(JSON.parse(cs))
        );

      console.log(devices);

      return devices;
    } catch (error: any) {
      error.claims = allClaimsRecord;
      this.logError(error);
      return [];
    }
  }

  //---------------------------------//

  private hasPosition = (position: TeamPositionInfo) =>
    this.position$() == position.value;

  //---------------------------------//
} //Cls
