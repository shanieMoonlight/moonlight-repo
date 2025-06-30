//#######################//

export type BaseCrudItem = { id: string };

//#######################//

export class CrudArrayOps<Item extends BaseCrudItem> {

    private _equals: (item1?: Item, item2?: Item) => boolean =
        ((item1?: Item, item2?: Item) => item1?.id === item2?.id)

    constructor(equals?: (item1?: Item, item2?: Item) => boolean) {
        if (equals)
            this._equals = equals
    }

    //- - - - - - - - - - - - - //

    append = (data: Item[], newItem: Item): Item[] =>
        [...data, newItem]

    delete = (data: Item[], deletedItem: Item): Item[] =>
        data.filter(item => !this._equals(item, deletedItem))

    insert = (data: Item[], updatedItem: Item): Item[] =>
        data.map(item => this._equals(item, updatedItem)
            ? { ...item, ...updatedItem }
            : item
        )

}//Cls