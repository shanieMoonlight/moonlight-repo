import { AppUserDto } from '@spider-baby/myid-io/models';
import { SbButtonIconDeleteComponent } from '@spider-baby/ui-kit/buttons';
import { ColumnData } from '@spider-baby/ui-kit/table';

export class SuperTeamTableActions{
    static delete = 'delete';
}


export const tableColumns: ColumnData<AppUserDto>[] = [

    ColumnData.create<AppUserDto>('userName'),
    ColumnData.create<AppUserDto>('email'),
    ColumnData.create<AppUserDto>('firstName'),
    ColumnData.create<AppUserDto>('lastName'),
    ColumnData.create<AppUserDto>(SuperTeamTableActions.delete)
        .setActionComponent(SbButtonIconDeleteComponent, {'color': 'error'}),
]
