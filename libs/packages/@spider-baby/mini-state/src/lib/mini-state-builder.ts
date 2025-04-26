import { DestroyRef, Signal } from "@angular/core"
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop"
import { Observable } from "rxjs"
import { MiniState } from "./mini-state"

export class MiniStateBuilder {

    static Create<Output>(triggerFn$: () => Observable<Output>, initialOutputValue?: Output) {
        const miniState = new MiniState<void, Output>(triggerFn$, initialOutputValue)
        return miniState
    }

    //-------------------------------------//

    static CreateWithInput<Input, Output>(triggerFn$: (input: Input) => Observable<Output>, initialOutputValue?: Output,) {
        const miniState = new MiniState<Input, Output>(triggerFn$, initialOutputValue)
        return miniState
    }

    //-------------------------------------//

    static CreateWithObservableInput<Input, Output>(
        input$: Observable<Input>,
        triggerFn$: (input: Input) => Observable<Output>,
        destroyer: DestroyRef,
        initialOutputValue?: Output) {

        const miniState = new MiniState<Input, Output>(triggerFn$, initialOutputValue)
        input$
            .pipe(takeUntilDestroyed(destroyer))
            .subscribe(t => miniState.trigger(t))

        return miniState
    }

    //-------------------------------------//

    static CreateWithSignalInput<Input, Output>(
        input$: Signal<Input>,
        triggerFn$: (input: Input) => Observable<Output>,
        destroyer: DestroyRef,
        initialOutputValue?: Output) {

        const miniState = new MiniState<Input, Output>(triggerFn$, initialOutputValue)
        toObservable(input$)
            .pipe(takeUntilDestroyed(destroyer))
            .subscribe(t => miniState.trigger(t))

        return miniState
    }
}//Cls

