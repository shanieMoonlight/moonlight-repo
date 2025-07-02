import { computed, Directive } from '@angular/core';
import { BaseAuthSignalService } from '@spider-baby/auth-signal';
import { TeamType } from '@spider-baby/myid-io/models';
import { TeamPositions } from '../../../id/utils/team-position-info';
import { MyIdRoleValues } from '../../claims/role-values';
import { MyIdJwtPayload } from './myid-jwt-payload';


@Directive({})
export abstract class AMyIdAuthService0 extends BaseAuthSignalService<MyIdJwtPayload>{//implements IMyIdAuthService {

    //------------- TEAMS -------------//    

    isSuper = computed(() => this.hasTeamTypeClaim('super'));
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
    position = computed(() => this.getPositionValue());


    //----------- SUPER TEAM ----------//    

    isSuperLdr = computed(() => this.isSuper() && this.isLdr());
    isSuperPosition = (position: number) => computed(() => this.isSuper() && this.hasPosition(position));

    isSuperAdmin = computed(() => this.isSuper() && this.isAdmin());
    isSuperMgr = computed(() => this.isSuper() && this.isMgr());
    isSuperUser = computed(() => this.isSuper() && this.isUser());
    isSuperGuest = computed(() => this.isSuper() && this.isGuest());


    //-------- MAINTENANCE TEAM -------//    

    isMntcLdr = computed(() => this.isMntc() && this.isLdr());
    isMntcPosition = (position: number) => computed(() => this.isMntc() && this.hasPosition(position));

    isMntcAdmin = computed(() => this.isMntc() && this.isAdmin());
    isMntcMgr = computed(() => this.isMntc() && this.isMgr());
    isMntcUser = computed(() => this.isMntc() && this.isUser());
    isMntcGuest = computed(() => this.isMntc() && this.isGuest());


    //--------- CUSTOMER TEAM ---------//


    isCusLdr = computed(() => this.isCustomer() && this.isLdr());
    isCusPosition = (position: number) => computed(() => this.isCustomer() && this.hasPosition(position));

    isCusAdmin = computed(() => this.isCustomer() && this.isAdmin());
    isCusMgr = computed(() => this.isCustomer() && this.isMgr());
    isCusUser = computed(() => this.isCustomer() && this.isUser());
    isCusGuest = computed(() => this.isCustomer() && this.isGuest());


    //------------ Minimums -----------//    

    isSuperLdrMinimum = computed(() => this.isSuperLdr());
    isSuperPositionMinimum = (position: number) => computed(() => this.isSuper() && this.hasPositionOrHigher(position));
    isSuperMinimum = computed(() => this.isSuperUserMinimum());

    isSuperAdminMinimum = computed(() => this.isSuperAdmin() || this.isSuperLdrMinimum());
    isSuperMgrMinimum = computed(() => this.isSuperMgr() || this.isSuperAdminMinimum());
    isSuperUserMinimum = computed(() => this.isSuperUser() || this.isSuperMgrMinimum());
    isSuperGuestMinimum = computed(() => this.isSuperGuest() || this.isSuperMgrMinimum());

    //- - - - - - - - - - - - - - - - -//

    isMntcLdrMinimum = computed(() => this.isMntcLdr() || this.isSuperMinimum());
    // isSuperPositionMinimum = (position: number) => computed(() => this.isSuper() && this.hasPositionOrHigher(position));

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
    isSuperOrDev = computed(() => this.isDevMode() || this.isSuper());
    isSuperMinimumOrDev = computed(() => this.isDevMode() || this.isSuperMinimum());

    //-------------------//


    private hasPosition = (position: number) =>
        this.position() == position;
    
    private hasPositionOrHigher = (position: number) =>
        this.position() >= position;


    //-------------------//


    hasTeamTypeClaim = (type: TeamType): boolean =>
        this.hasClaim('myid.team_type', type)

    getPositionValue = () => {
        const posStr = this.getClaimValue("myid.team_position") ?? '';
        const posNum = Number(posStr);
        return Number.isNaN(posNum) ? -1 : posNum;
    }

} //Cls
