import { Type } from "@angular/core"

//#############################//

export class ActionTableCell{

    constructor(
        public component: Type<unknown>,
        public inputs?: Record<string, unknown>
      ) { }
}

//#############################//