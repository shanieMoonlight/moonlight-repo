import { Observable } from 'rxjs'
import { MiniState } from '../mini-state'
import { MiniCrudState } from './mini-state-crud'
import { DestroyRef, inject } from '@angular/core'

/**
 * Builder for MiniCrudState — provides a fluent API for supplying
 * optional add/update/delete states before constructing the final instance.
 */
export class MiniCrudStateBuilder<
    GetFilter,
    Item extends { id: string | number },
    CreateItemDto extends Omit<Item, 'id'> = Omit<Item, 'id'>,
    UpdateItemDto extends Partial<Item> & { id: string | number } = Partial<Item> & { id: string | number },
    UpdateResponse extends Partial<Item> = Partial<Item>,
    DeleteResponse = any,
    TError = any
> {
    private _getAllState!: MiniState<GetFilter, Item[]>
    private _addState?: MiniState<CreateItemDto, Item>
    private _updateState?: MiniState<UpdateItemDto, UpdateResponse>
    private _deleteState?: MiniState<Item, DeleteResponse>
    private _destroyer!: DestroyRef

    //-------------------//

    private constructor(
        getAllTrigger: (input: GetFilter) => Observable<Item[]>,
        successMsgFn?: (input: GetFilter, output: Item[]) => string,
        destroyer?: DestroyRef
    ) {
        this._destroyer = destroyer ?? inject(DestroyRef)
        this._getAllState = new MiniState<GetFilter, Item[]>(getAllTrigger, this._destroyer)
        // ensure consumer sees an initial empty collection
        this._getAllState.setInitialOutputValue([] as Item[])
        this._getAllState.setSuccessMsgFn(successMsgFn)
    }


    static Create<GetFilter, Item extends { id: string | number }>(
        getAllTrigger: (input: GetFilter) => Observable<Item[]>,
        successMsgFn?: (input: GetFilter, output: Item[]) => string,
        destroyer?: DestroyRef
    ) {
        return new MiniCrudStateBuilder(getAllTrigger, successMsgFn, destroyer)
    }

    //-------------------//

    setAddState(
        addTrigger: (input: CreateItemDto) => Observable<Item>,
        successMsgFn?: (input: CreateItemDto, output: Item) => string
    ) {
        this._addState = new MiniState<CreateItemDto, Item>(addTrigger, this._destroyer)
        this._addState.setSuccessMsgFn(successMsgFn)
        return this
    }


    setUpdateState(
        updateTrigger: (input: UpdateItemDto) => Observable<UpdateResponse>,
        successMsgFn?: (input: UpdateItemDto, output: UpdateResponse) => string
    ) {
        this._updateState = new MiniState<UpdateItemDto, UpdateResponse>(updateTrigger, this._destroyer)
        this._updateState.setSuccessMsgFn(successMsgFn)
        return this
    }


    setDeleteState(
        deleteTrigger: (input: Item) => Observable<DeleteResponse>,
        successMsgFn?: (input: Item, output: DeleteResponse) => string
    ) {
        this._deleteState = new MiniState<Item, DeleteResponse>(deleteTrigger, this._destroyer)
        this._deleteState.setSuccessMsgFn(successMsgFn)
        return this
    }

    //-------------------//


    buildAndTrigger(filter: GetFilter) {
        console.log(`This is the filter: ${filter}`);

        const crudState = this.build()
        crudState.triggerGetAll(filter)

        return crudState
    }


    build() {

        if (!this._getAllState)
            throw new Error('getAll trigger is required')

        const crudState = MiniCrudState.Create<
            GetFilter,
            Item,
            CreateItemDto,
            UpdateItemDto,
            UpdateResponse,
            DeleteResponse,
            TError
        >(
            this._getAllState,
            this._addState,
            this._updateState,
            this._deleteState
        )

        return crudState
    }

}//Cls
