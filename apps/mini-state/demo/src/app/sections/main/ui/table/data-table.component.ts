import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
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
    deleteItem = output<T>();
    refresh = output<void>();

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

    protected onDeleteItem = (item: T) =>
        this.deleteItem.emit(item)

    protected onRefresh = () =>
        this.refresh.emit()

    //--------------------------//

}//Cls