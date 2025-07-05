import { ColumnData } from '../column';

export class ActionEvent<T>{

    public action: string = 'action'
    public rowIdx = -1


    constructor(
        public item: T,
        col: ColumnData<T>
    ) {
        this.action = col.name
        // this.action = col?.handleNestedProperty 
        // ? col.handleNestedProperty(item) 
        // : col.name
    }


    setRowIdx(rowIdx: number){
        this.rowIdx =  rowIdx
        return this
    }

}