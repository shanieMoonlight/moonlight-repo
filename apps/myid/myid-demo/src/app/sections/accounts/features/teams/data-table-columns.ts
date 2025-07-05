import { Injectable, computed, inject } from '@angular/core';
import { TeamDto } from '@spider-baby/myid-io/models';
import { SbButtonIconDeleteComponent } from '@spider-baby/ui-kit/buttons';
import { ColumnData } from '@spider-baby/ui-kit/table';
import { MyIdAuthService} from '@spider-baby/myid-auth/services';

//########################//

export class TeamsTableActions {
    static delete = 'delete';
}

const readOnlyTableColumns: ColumnData<TeamDto>[] = [

    ColumnData.create<TeamDto>('name'),
    ColumnData.create<TeamDto>('teamType'),
    ColumnData.create<TeamDto>('minPosition'),
    ColumnData.create<TeamDto>('maxPosition')
]

//########################//

@Injectable({
    providedIn: 'root'
})
export class TeamsTableColumnsService {


    tableColumns = computed(() => readOnlyTableColumns)
}