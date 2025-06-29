import { BaseDataTableRowData } from "./base-row-data";

export class ColumnData<T = BaseDataTableRowData> {
    
    handleNestedProperty?: (x: T) => unknown


    private constructor(public name: string = '') {
        this.name = name;
    }

    static create<T extends BaseDataTableRowData>(name: string): ColumnData<T> {
        return new ColumnData(name);
    }




}