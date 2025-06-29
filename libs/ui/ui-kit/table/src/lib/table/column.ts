import { BaseDataTableRowDtata } from "./base-row-data";

export class ColumnData<T = BaseDataTableRowDtata> {
    
    handleNestedProperty?: (x: T) => unknown


    private constructor(public name: string = '') {
        this.name = name;
    }

    static create(name: string): ColumnData {
        return new ColumnData(name);
    }




}