import { Type } from "@angular/core"

//#############################//

export class ActionTableCell{

    constructor(
        public component: Type<unknown>,
        public inputs?: Record<string, unknown>
      ) { }
}

//#############################//

// @Directive({})
// export abstract class BaseCustomActionComponent<T>{    
//   item = input.required<T>()
//   column = input.required<ColumnData>()
// }

// //#############################//