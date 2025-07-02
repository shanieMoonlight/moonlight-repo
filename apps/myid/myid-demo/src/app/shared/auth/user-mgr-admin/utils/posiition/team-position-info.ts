import { Injectable } from "@angular/core"

export class TeamPositionInfo {
    constructor(
        public name: string,
        public value: number
    ) { }
}

//#############################//

const TEAM_POSITION_GUEST = new TeamPositionInfo('Guest', 0)
const TEAM_POSITION_USER = new TeamPositionInfo('User', 1)
const TEAM_POSITION_MGR = new TeamPositionInfo('Mananger', 2)
const TEAM_POSITION_ADMIN = new TeamPositionInfo('Admin', 3)

//#############################//

export class TeamPositions {

    static readonly GUEST = TEAM_POSITION_GUEST
    static readonly USER = TEAM_POSITION_USER
    static readonly MGR = TEAM_POSITION_MGR
    static readonly ADMIN = TEAM_POSITION_ADMIN
}

//#############################//


export class TeamPositionUtils{

    static getTeamPositionByValue(value: number): TeamPositionInfo | undefined {
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

    static getTeamPositionByName(name: string): TeamPositionInfo | undefined {
        switch (name.toLowerCase()) {
            case TeamPositions.USER.name.toLowerCase():
                return TeamPositions.USER;
            case TeamPositions.MGR.name.toLowerCase():
                return TeamPositions.MGR;
            case TeamPositions.ADMIN.name.toLowerCase():
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
export class TeamPositionService{

    getTeamPositionByValue(value: number): TeamPositionInfo | undefined {
        return TeamPositionUtils.getTeamPositionByValue(value);
    }

    getTeamPositionByName(name: string): TeamPositionInfo | undefined {
        return TeamPositionUtils.getTeamPositionByName(name);
    }

}

