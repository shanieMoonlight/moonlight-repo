import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BaseDataTableRowData } from '../base-row-data';
import { ColumnData } from '../column';

@Component({
    selector: 'sb-data-table-cell',
    standalone: true,
    templateUrl: './table-cell.component.html',
    styleUrls: ['./table-cell.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbDataTableCellComponent<T extends BaseDataTableRowData> {

    item = input.required<T>();
    column = input.required<ColumnData<T>>();

    value = computed(() => {
        const item = this.item();
        const col = this.column();
        // Support custom accessor if provided on column
        // if (typeof col.accessor === 'function') {
        //   return col.accessor(item);
        // }
        return item[col.name as keyof T];
    })

}
