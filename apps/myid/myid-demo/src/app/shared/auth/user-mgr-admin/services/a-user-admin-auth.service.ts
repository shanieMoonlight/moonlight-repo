import { computed } from "@angular/core";
import { TeamPositions } from "../../../id/utils/team-position-info";
import { AMyIdAuthService } from "../../services/auth/a-myid.auth.service";


// New subclass for app-specific roles
export abstract class AUserMgrAdminAuthService extends AMyIdAuthService {
    
    isUser = computed(() => this.hasPosition(TeamPositions.USER.value));
    isMgr = computed(() => this.hasPosition(TeamPositions.MGR.value));
    isAdmin = computed(() => this.hasPosition(TeamPositions.ADMIN.value));
    isGuest = computed(() => this.hasPosition(TeamPositions.GUEST.value));



    isSuperAdmin = computed(() => this.isSuper() && this.isAdmin());
    isSuperMgr = computed(() => this.isSuper() && this.isMgr());
    isSuperUser = computed(() => this.isSuper() && this.isUser());
    isSuperGuest = computed(() => this.isSuper() && this.isGuest());
    
    isSuperAdminMinimum = computed(() => this.isSuperAdmin() || this.isSuperLdrMinimum());
    isSuperMgrMinimum = computed(() => this.isSuperMgr() || this.isSuperAdminMinimum());
    isSuperUserMinimum = computed(() => this.isSuperUser() || this.isSuperMgrMinimum());
    isSuperGuestMinimum = computed(() => this.isSuperGuest() || this.isSuperMgrMinimum());



    isMntcAdmin = computed(() => this.isMntc() && this.isAdmin());
    isMntcMgr = computed(() => this.isMntc() && this.isMgr());
    isMntcUser = computed(() => this.isMntc() && this.isUser());
    isMntcGuest = computed(() => this.isMntc() && this.isGuest());

    isMntcAdminMinimum = computed(() => this.isMntcAdmin() || this.isMntcLdrMinimum());
    isMntcMgrMinimum = computed(() => this.isMntcMgr() || this.isMntcAdminMinimum());
    isMntcUserMinimum = computed(() => this.isMntcUser() || this.isMntcMgrMinimum());
    isMntcGuestMinimum = computed(() => this.isMntcGuest() || this.isMntcUserMinimum());



    isCusAdmin = computed(() => this.isCustomer() && this.isAdmin());
    isCusMgr = computed(() => this.isCustomer() && this.isMgr());
    isCusUser = computed(() => this.isCustomer() && this.isUser());
    isCusGuest = computed(() => this.isCustomer() && this.isGuest());

    isCusAdminMinimum = computed(() => this.isCusAdmin() || this.isCusLdrMinimum());
    isCusMgrMinimum = computed(() => this.isCusMgr() || this.isCusAdminMinimum());
    isCusUserMinimum = computed(() => this.isCusUser() || this.isCusMgrMinimum());
    isCusGuestMinimum = computed(() => this.isCusGuest() || this.isCusUserMinimum());

    // Add any app-specific minimums or composite signals as needed
}
