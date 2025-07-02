import { computed, Directive } from '@angular/core';
import { TeamType } from '@spider-baby/myid-io/models';
import { TeamPositionInfo, TeamPositions } from '../../../id/utils/team-position-info';
import { BaseAuthSignalService } from '@spider-baby/auth-signal';
import { MyIdRoleValues } from '../../claims/role-values';
import { MyIdJwtPayload } from './myid-jwt-payload';


@Directive({})
export abstract class AMyIdAuthService extends BaseAuthSignalService<MyIdJwtPayload> {

    //------------- TEAMS -------------//    

    isSpr = computed(() => this.hasTeamTypeClaim('super'));
    isMntc = computed(() => this.hasTeamTypeClaim('maintenance'));
    isCustomer = computed(() => this.hasTeamTypeClaim('customer'));


    //-------- TEAM POSITION ----------//    

    isLdr = computed(() => this.hasRole(MyIdRoleValues.TEAM_LEADER));

    isUser = computed(() => this.hasPosition(TeamPositions.USER.value));
    isMgr = computed(() => this.hasPosition(TeamPositions.MGR.value));
    isAdmin = computed(() => this.hasPosition(TeamPositions.ADMIN.value));
    isGuest = computed(() => this.hasPosition(TeamPositions.GUEST.value));

    teamId = computed(() => this.getClaimValue('myid.team_id') ?? '');
    teamType = computed(() => this.getClaimValue('myid.team_type') ?? '');
    position = computed(() => this.getTeamPositionValue());


    //----------- SUPER TEAM ----------//    

    isSprLdr = computed(() => this.isSpr() && this.isLdr());
    isSprPosition = (position: number) => computed(() => this.isSpr() && this.hasPosition(position));

    isSprAdmin = computed(() => this.isSpr() && this.isAdmin());
    isSprMgr = computed(() => this.isSpr() && this.isMgr());
    isSprUser = computed(() => this.isSpr() && this.isUser());
    isSprGuest = computed(() => this.isSpr() && this.isGuest());


    //-------- MAINTENANCE TEAM -------//    

    isMntcLdr = computed(() => this.isMntc() && this.isLdr());

    isMntcAdmin = computed(() => this.isMntc() && this.isAdmin());
    isMntcMgr = computed(() => this.isMntc() && this.isMgr());
    isMntcUser = computed(() => this.isMntc() && this.isUser());
    isMntcGuest = computed(() => this.isMntc() && this.isGuest());


    //--------- CUSTOMER TEAM ---------//


    isCusLdr = computed(() => this.isCustomer() && this.isLdr());

    isCusAdmin = computed(() => this.isCustomer() && this.isAdmin());
    isCusMgr = computed(() => this.isCustomer() && this.isMgr());
    isCusUser = computed(() => this.isCustomer() && this.isUser());
    isCusGuest = computed(() => this.isCustomer() && this.isGuest());


    //------------ Minimums -----------//    

    isSprLdrMinimum = computed(() => this.isSprLdr());
    isSprAdminMinimum = computed(() => this.isSprAdmin() || this.isSprLdrMinimum());
    isSprMgrMinimum = computed(() => this.isSprMgr() || this.isSprAdminMinimum());
    isSprUserMinimum = computed(() => this.isSprUser() || this.isSprMgrMinimum());
    isSprGuestMinimum = computed(() => this.isSprGuest() || this.isSprMgrMinimum());
    isSprMinimum = computed(() => this.isSprUserMinimum());

    //- - - - - - - - - - - - - - - - -//

    isMntcLdrMinimum = computed(() => this.isMntcLdr() || this.isSprMinimum());
    isMntcAdminMinimum = computed(() => this.isMntcAdmin() || this.isMntcLdrMinimum());
    isMntcMgrMinimum = computed(() => this.isMntcMgr() || this.isMntcAdminMinimum());
    isMntcUserMinimum = computed(() => this.isMntcUser() || this.isMntcMgrMinimum());
    isMntcGuestMinimum = computed(() => this.isMntcGuest() || this.isMntcUserMinimum());
    isMntcMinimum = computed(() => this.isMntcGuestMinimum());

    //- - - - - - - - - - - - -//

    isCusLdrMinimum = computed(() => this.isCusLdr() || this.isMntcMinimum());
    isCusAdminMinimum = computed(() => this.isCusAdmin() || this.isCusLdrMinimum());
    isCusMgrMinimum = computed(() => this.isCusMgr() || this.isCusAdminMinimum());
    isCusUserMinimum = computed(() => this.isCusUser() || this.isCusMgrMinimum());
    isCusGuestMinimum = computed(() => this.isCusGuest() || this.isCusUserMinimum());
    isCusMinimum = computed(() => this.isCusGuestMinimum());


    //------------  DevMode -----------//

    isMntcOrDev = computed(() => this.isDevMode() || this.isMntc());
    isMntcMinimumOrDev = computed(() => this.isDevMode() || this.isMntcMinimum());
    isSuperOrDev = computed(() => this.isDevMode() || this.isSpr());
    isSuperMinimumOrDev = computed(() => this.isDevMode() || this.isSprMinimum());

    //-------------------//


    private hasPosition = (position: number) =>
        this.position() == position;


    //-------------------//


    hasTeamTypeClaim = (type: TeamType): boolean =>
        this.hasClaim('myid.team_type', type)

    getTeamPositionValue = () => {
        const posStr = this.getClaimValue("myid.team_position") ?? '';
        const posNum = Number(posStr);
        return Number.isNaN(posNum) ? -1 : posNum;
    }

} //Cls
