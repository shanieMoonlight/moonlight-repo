import { computed, Directive } from '@angular/core';
import { BaseAuthSignalService } from '@spider-baby/auth-signal';
import { TeamType } from '@spider-baby/myid-io/models';
import { MyIdRoleValues } from '../../claims/role-values';
import { IMyIdAuthService } from './i-myid.auth.service';
import { MyIdJwtPayload } from './myid-jwt-payload';


@Directive({})
export abstract class AMyIdAuthService extends BaseAuthSignalService<MyIdJwtPayload> implements IMyIdAuthService {
    
    
    teamId = computed(() => this.getClaimValue('myid.team_id') ?? '');
    teamType = computed(() => this.getClaimValue('myid.team_type') ?? '');
    position = computed(() => this.getPositionValue());
    isLdr = computed(() => this.hasRole(MyIdRoleValues.TEAM_LEADER));
    
    
    //----------- SUPER TEAM ----------//   
    
    isSuper = computed(() => this.hasTeamTypeClaim('super'));
    
    isSuperLdr = computed(() => this.isSuper() && this.hasRole(MyIdRoleValues.TEAM_LEADER));
    isSuperPosition = (position: number) => computed(() => this.isSuper() && this.hasPosition(position));
    
    isSuperPositionMinimum = (position: number) => computed(() => this.isSuper() && this.hasPositionOrHigher(position));
    isSuperMinimum = computed(() => this.isSuperPositionMinimum(0)());
    
    isSuperOrDev = computed(() => this.isDevMode() || this.isSuper());
    isSuperMinimumOrDev = computed(() => this.isDevMode() || this.isSuperMinimum());
    
    
    //-------- MAINTENANCE TEAM -------//   
    
    isMntc = computed(() => this.hasTeamTypeClaim('maintenance'));
    
    isMntcLdr = computed(() => this.isMntc() && this.hasRole(MyIdRoleValues.TEAM_LEADER));
    isMntcPosition = (position: number) => computed(() => this.isMntc() && this.hasPosition(position));
    
    isMntcLdrMinimum = computed(() => this.isMntcLdr() || this.isSuperMinimum());
    isMntcPositionMinimum = (position: number) => computed(() =>
        (this.isMntc() && this.hasPositionOrHigher(position)) || this.isSuperMinimum());
    isMntcMinimum = computed(() => this.isMntcPositionMinimum(0)());

    isMntcOrDev = computed(() => this.isDevMode() || this.isMntc());
    isMntcMinimumOrDev = computed(() => this.isDevMode() || this.isMntcMinimum());
    
    
    //--------- CUSTOMER TEAM ---------//
    
    isCustomer = computed(() => this.hasTeamTypeClaim('customer'));

    isCusLdr = computed(() => this.isCustomer() && this.hasRole(MyIdRoleValues.TEAM_LEADER));
    isCusPosition = (position: number) => computed(() => this.isCustomer() && this.hasPosition(position));

    isCusLdrMinimum = computed(() => this.isCusLdr() || this.isMntcMinimum());
    isCusPositionMinimum = (position: number) => computed(() =>
        (this.isCustomer() && this.hasPositionOrHigher(position)) || this.isMntcMinimum());
    isCusMinimum = computed(() => this.isCusPositionMinimum(0)());


    //-------------------//


    protected hasPosition = (position: number) =>
        this.position() == position;

    protected hasPositionOrHigher = (position: number) =>
        this.position() >= position;

    getPositionValue = () => {
        const posStr = this.getClaimValue("myid.team_position") ?? '';
        const posNum = Number(posStr);
        return Number.isNaN(posNum) ? -1 : posNum;
    }

    //-------------------//

    hasTeamTypeClaim = (type: TeamType): boolean =>
        this.hasClaim('myid.team_type', type)

}//Cls
