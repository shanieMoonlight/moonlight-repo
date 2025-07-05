import { Injectable, computed, inject } from '@angular/core';
import { AppUserCustomerDto } from '@spider-baby/myid-io/models';
import { SbButtonIconDeleteComponent } from '@spider-baby/ui-kit/buttons';
import { ColumnData } from '@spider-baby/ui-kit/table';
import { MyIdAuthService} from '@spider-baby/myid-auth/services';
//########################//

export class CustomersTableActions {
    static delete = 'delete';
}

const readOnlyTableColumns: ColumnData<AppUserCustomerDto>[] = [

    ColumnData.create<AppUserCustomerDto>('userName'),
    ColumnData.create<AppUserCustomerDto>('email'),
    ColumnData.create<AppUserCustomerDto>('firstName'),
    ColumnData.create<AppUserCustomerDto>('lastName')
]

const mntcMinTableColumns: ColumnData<AppUserCustomerDto>[] = [
    ColumnData.create<AppUserCustomerDto>(CustomersTableActions.delete)
        .setActionComponent(SbButtonIconDeleteComponent, { 'color': 'error' }),
]

//########################//

@Injectable({
    providedIn: 'root'
})
export class CustomersTableColumnsService {

    private _auth = inject(MyIdAuthService)

    tableColumns = computed(() => this._auth.isMntcMinimum()
        ? [...readOnlyTableColumns, ...mntcMinTableColumns]
        : readOnlyTableColumns
    )
}