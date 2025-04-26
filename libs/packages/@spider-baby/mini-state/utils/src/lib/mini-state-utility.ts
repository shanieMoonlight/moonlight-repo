import { merge } from "rxjs";
import { MessageData, MiniState } from "@spider-baby/mini-state";
import { toSignal } from "@angular/core/rxjs-interop";
import { Signal, computed } from "@angular/core";

export class MsUtility {

    static combineErrors = (...miniStates: MiniState<any, any>[]): Signal<any> =>
        toSignal(merge(
            ...miniStates.map(st => st.error$)
        ))

    //- - - - - - - - - - - - -//

    static combineErrorMsgs = (...miniStates: MiniState<any, any>[]): Signal<MessageData | undefined> =>
        toSignal(merge(
            ...miniStates.map(st => st.errorMsg$)
        ))

    //- - - - - - - - - - - - -//

    static combineSuccessMsgs = (...miniStates: MiniState<any, any>[]): Signal<MessageData | undefined> =>
        toSignal(merge(
            ...miniStates.map(st => st.successMsg$)
        ))

    //- - - - - - - - - - - - -//

    static combineLoading = (...miniStates: MiniState<any, any>[]) =>
        computed(() => miniStates.map(st => st.loading())
            .reduce((acc, curr) => acc || curr, false)
        )

    //- - - - - - - - - - - - -//

    static combineData = <T>(...miniStates: MiniState<any, T>[]): Signal<T | undefined> =>
        toSignal(merge(
            ...miniStates.map(st => st.data$)
        ))



}//Cls