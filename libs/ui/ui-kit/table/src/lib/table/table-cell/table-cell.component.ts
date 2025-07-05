import { NgComponentOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { BaseDataTableRowData } from '../base-row-data';
import { ColumnData } from '../column';
import { ActionEvent } from './action-event';

@Component({
    selector: 'sb-data-table-cell',
    standalone: true,
    imports: [
        NgComponentOutlet
    ],
    templateUrl: './table-cell.component.html',
    styleUrls: ['./table-cell.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbDataTableCellComponent<T extends BaseDataTableRowData> {

    item = input.required<T>();
    column = input.required<ColumnData<T>>();

    actionEvent = output<ActionEvent<T>>({ alias: 'action' })

    value = computed(() => {
        const item = this.item();
        const col = this.column();
        // Support custom accessor if provided on column
        // if (typeof col.accessor === 'function') {
        //   return col.accessor(item);
        // }
        return item[col.name as keyof T];
    })

    filterDataType = computed(() => this.column().filterDataType)


    protected actionClick(event: Event) {        

        event.stopPropagation()
        const item = this.item()
        if (!item)
            return

        this.actionEvent.emit(new ActionEvent<T>(item, this.column()))

    }

}
