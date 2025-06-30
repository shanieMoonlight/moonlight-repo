import { Type } from "@angular/core";
import { BaseDataTableRowData } from "./base-row-data";
import { ActionTableCell } from "./custom-cell";
import { FilterDataType } from "./types";

export class ColumnData<T = BaseDataTableRowData> {

    handleNestedProperty?: (x: T) => unknown
    actionTableCell?: ActionTableCell


    private constructor(
        public name: string = '',
        public filterDataType: FilterDataType = 'string',

    ) {
        this.name = name;
        this.setFilterDataType(filterDataType ?? 'string');
    }

    static create<T extends BaseDataTableRowData>(name: string): ColumnData<T> {
        return new ColumnData(name);
    }

  //- - - - - - - - - - - - - - - //

  setFilterDataType(filterDataType: FilterDataType): ColumnData<T> {

    this.filterDataType = filterDataType
    return this
  } 


  /**
   * Custom Component for displaying action button
   * @param component Custom component, 
   * @param inputs Inputs for the custom component
  */
  setActionComponent(component: Type<unknown>, inputs?: Record<string, unknown>): ColumnData<T> {

    this.actionTableCell = new ActionTableCell(component, inputs)
    this.setFilterDataType('action')
    return this

  }




}