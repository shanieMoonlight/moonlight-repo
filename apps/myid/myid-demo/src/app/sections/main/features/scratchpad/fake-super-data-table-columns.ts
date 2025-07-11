import { AppUserDto } from '@spider-baby/myid-io/models';
import { ColumnData } from '@spider-baby/ui-kit/table';

export const tableColumns: ColumnData<AppUserDto>[] = [

    ColumnData.create<AppUserDto>('userName'),
    ColumnData.create<AppUserDto>('email'),
    ColumnData.create<AppUserDto>('firstName'),
    ColumnData.create<AppUserDto>('lastName'),
]