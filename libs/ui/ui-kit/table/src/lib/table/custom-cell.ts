import { Directive, Type, input } from "@angular/core"
import { ColumnData } from "./column"

//#############################//

export class CustomTableCell<T> {

    constructor(
        public component: Type<unknown>,
        public inputs?: Record<string, unknown>) { }
}

//#############################//

@Directive({})
export abstract class BaseCustomActionComponent<T>{    
  item = input.required<T>()
  column = input.required<ColumnData>()
}

//#############################//