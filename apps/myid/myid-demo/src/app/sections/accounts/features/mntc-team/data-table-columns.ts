import { Injectable, computed, inject } from '@angular/core';
import { AppUserDto } from '@spider-baby/myid-io/models';
import { SbButtonIconDeleteComponent } from '@spider-baby/ui-kit/buttons';
import { ColumnData } from '@spider-baby/ui-kit/table';
import { MyIdAuthService} from '@spider-baby/myid-auth/services';

//########################//

export class MntcTeamTableActions {
    static delete = 'delete';
}

const readOnlyTableColumns: ColumnData<AppUserDto>[] = [

    ColumnData.create<AppUserDto>('userName'),
    ColumnData.create<AppUserDto>('email'),
    ColumnData.create<AppUserDto>('firstName'),
    ColumnData.create<AppUserDto>('lastName')
]

const mntcTeamTableColumns: ColumnData<AppUserDto>[] = [
    ColumnData.create<AppUserDto>(MntcTeamTableActions.delete)
        .setActionComponent(SbButtonIconDeleteComponent, { 'color': 'error' }),
]

//########################//

@Injectable({
    providedIn: 'root'
})
export class MntcTeamTableColumnsService {

    private _auth = inject(MyIdAuthService)

    tableColumns = computed(() => this._auth.isMntc()
        ? [...readOnlyTableColumns, ...mntcTeamTableColumns]
        : readOnlyTableColumns
    )
}