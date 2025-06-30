import { computed, signal } from '@angular/core';
import { CrudArrayOps } from "./crud-array-ops";

//#######################//

export type BaseCrudItem = { id: string };

//#######################//

export class CrudArraySignalOps<Item extends BaseCrudItem> {

    private _data = signal<Item[]>([]);
    private _crudOps: CrudArrayOps<Item>
    data = computed(() => this._data())



    constructor(
        intialData: Item[] = [],
        equals?: (item1?: Item, item2?: Item) => boolean
    ) {
        this.refresh(intialData);
        this._crudOps = new CrudArrayOps<Item>(equals);
    }

    //- - - - - - - - - - - - - //

    refresh = (newItems: Item[]) =>
        this._data.set(newItems)

    append = (newItem: Item) =>
        this._data.update(data => this._crudOps.append(data, newItem));

    delete = (deletedItem: Item) =>
        this._data.update(data => this._crudOps.delete(data, deletedItem));

    insert = (updatedItem: Item) =>
        this._data.update(data => this._crudOps.insert(data, updatedItem));

}//Cls