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
    _data = input<T[]>([], {alias: 'data'});
    _displayColumns = input<string[]>([],  {alias: 'displayColumns'});
    _isLoading = input<boolean>(false,  {alias: 'isLoading'});
    _includeActions = input<boolean>(true,  {alias: 'includeActions'});
    _title = input<string>('Data Table',  {alias: 'title'});
    _emptyMessage = input<string>('No data found. Try refreshing.',  {alias: 'emptyMessage'});
    _loadingMessage = input<string>('Loading data...',  {alias: 'loadingMessage'});
    _itemName = input<string>('item',  {alias: 'itemName'});
    _iconName = input<string>('table_chart',  {alias: 'iconName'});
    _canAddItem = input<boolean>(false,  {alias: 'canAddItem'});

    //- - - - - - - - - - - - - //

    // Event outputs
    viewDetails = output<T>();
    editItem = output<T>();
    editItem2 = output<T>();
    deleteItem = output<T>();
    refresh = output<void>();
    addItem = output<void>();

    //--------------------------//

    protected allDisplayColumns = computed(() => {
        const columns = [...this._displayColumns()]
        if (this._includeActions())
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