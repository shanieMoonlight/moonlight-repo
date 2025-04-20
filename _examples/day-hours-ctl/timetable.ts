import { FormControl, FormGroup } from '@angular/forms';

export type Identifier = number | string | null | undefined;

//=========================================//

export class Day {

    public name: string = ''
    constructor(
        public openTime?: string | null,
        public closeTime?: string | null,
        public closed: boolean = false,
    ) { }
}

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//

export interface IDayForm
    extends FormGroup<{
        openTime: FormControl<Date | null>
        closeTime: FormControl<Date | null>
        closed: FormControl<boolean | null>
    }> { }

//=========================================//

export class Timetable {

    constructor(
        public monday: Day,
        public tuesday: Day,
        public wednesday: Day,
        public thursday: Day,
        public friday: Day,
        public saturday: Day,
        public sunday: Day,
        public id?: Identifier,
        public extraInfo?: string |null
    ) { }
}

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//

export interface ITimetableForm
    extends FormGroup<{
        id: FormControl<Identifier>
        monday: FormControl<Day | null>
        tuesday: FormControl<Day | null>
        wednesday: FormControl<Day | null>
        thursday: FormControl<Day | null>
        friday: FormControl<Day | null>
        saturday: FormControl<Day | null>
        sunday: FormControl<Day | null>
        extraInfo: FormControl<string | null>
    }> { }

//=========================================//
