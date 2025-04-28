import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, input, NgZone, Output, output } from '@angular/core';
import { MatEverythingModule } from '@spider-baby/material-theming/utils';

@Component({
    selector: 'sb-data-table',
    standalone: true,
    imports: [
        CommonModule,
        MatEverythingModule
    ],
    templateUrl: './data-table.component.html',
    styleUrl: './data-table.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTableComponent<T> {

    // Input signals
    items = input<T[]>([]);
    displayColumns = input<string[]>([]);
    isLoading = input<boolean>(false);
    includeActions = input<boolean>(true);
    title = input<string>('Data Table');
    emptyMessage = input<string>('No data found. Try refreshing.');
    loadingMessage = input<string>('Loading data...');
    itemName = input<string>('item');
    iconName = input<string>('table_chart');

    //- - - - - - - - - - - - - //

    // Event outputs
    viewDetails = output<T>();
    editItem = output<T>();
    editItem2 = output<T>();
    deleteItem = output<T>();
    refresh = output<void>();
    // refresh2 = output<void>();
    addItem = output<void>();
    // @Output() addItem = new EventEmitter<boolean>();
    @Output() refresh2 = new EventEmitter<boolean>();

    //--------------------------//

    /**
     *
     */
    constructor(private zone: NgZone) {
        this.addItem.subscribe((value) => {
            console.log('Add item event emitted:', value);
        })

    }

    //--------------------------//

    protected allDisplayColumns = computed(() => {
        const columns = [...this.displayColumns()]
        if (this.includeActions())
            columns.push('actions')
        return columns
    })

    //--------------------------//

    // Handler methods
    protected onViewDetails = (item: T) =>
        this.viewDetails.emit(item);

    protected onEditItem = (item: T) =>
        this.editItem.emit(item)


    protected onAddItem = () =>
        this.addItem.emit()

    protected onDeleteItem = (item: T) =>
        this.deleteItem.emit(item)

    protected onRefresh = () =>
        this.refresh.emit()

    //--------------------------//

}//Cls