import { Injectable } from "@angular/core"
import { TeamPositionOption } from "@spider-baby/myid-auth/config"

export class UserMgrAdminTeamPositionOption implements TeamPositionOption {
    constructor(
        public value: number,
        public label: string
    ) { }
}

//#############################//

const TEAM_POSITION_GUEST = new UserMgrAdminTeamPositionOption(0, 'Guest')
const TEAM_POSITION_USER = new UserMgrAdminTeamPositionOption(1, 'User')
const TEAM_POSITION_MGR = new UserMgrAdminTeamPositionOption(2, 'Mananger')
const TEAM_POSITION_ADMIN = new UserMgrAdminTeamPositionOption(3, 'Admin')

//#############################//

export class TeamPositions {

    static readonly GUEST = TEAM_POSITION_GUEST
    static readonly USER = TEAM_POSITION_USER
    static readonly MGR = TEAM_POSITION_MGR
    static readonly ADMIN = TEAM_POSITION_ADMIN
}

//#############################//


export class TeamPositionUtils {

    static getTeamPositionByValue(value: number): TeamPositionOption | undefined {
        switch (value) {
            case TeamPositions.USER.value:
                return TeamPositions.USER;
            case TeamPositions.MGR.value:
                return TeamPositions.MGR;
            case TeamPositions.ADMIN.value:
                return TeamPositions.ADMIN;
            default:
                return undefined;
        }
    }

    static getTeamPositionByName(name: string): TeamPositionOption | undefined {
        switch (name.toLowerCase()) {
            case TeamPositions.USER.label.toLowerCase():
                return TeamPositions.USER;
            case TeamPositions.MGR.label.toLowerCase():
                return TeamPositions.MGR;
            case TeamPositions.ADMIN.label.toLowerCase():
                return TeamPositions.ADMIN;
            default:
                return undefined;
        }
    }

}


//#############################//


@Injectable({
    providedIn: 'root'
})
export class TeamPositionService {

    getTeamPositionByValue(value: number): TeamPositionOption | undefined {
        return TeamPositionUtils.getTeamPositionByValue(value);
    }

    getTeamPositionByName(name: string): TeamPositionOption | undefined {
        return TeamPositionUtils.getTeamPositionByName(name);
    }

}

