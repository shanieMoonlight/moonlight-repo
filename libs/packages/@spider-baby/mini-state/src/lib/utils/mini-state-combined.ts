import { Signal } from "@angular/core";
import { MiniState } from "../mini-state";
import { MiniStateUtility } from "./mini-state-utility";
import { Observable } from "rxjs";

export class MiniStateCombined {

    readonly errorMsg: Signal<string | undefined>
    readonly errorMsg$: Observable<string | undefined>
    readonly error: Signal<any>
    readonly error$: Observable<any>
    readonly loading: Signal<boolean>
    readonly loading$: Observable<boolean>
    readonly successMsg: Signal<string | undefined>
    readonly successMsg$: Observable<string | undefined>
    readonly data: Signal<any | undefined>
    readonly data$: Observable<any | undefined>

    private constructor(miniStates: MiniState<any, any>[]) {
        this.loading = MiniStateUtility.combineLoading(...miniStates)
        this.error = MiniStateUtility.combineErrors(...miniStates)
        this.successMsg = MiniStateUtility.combineSuccessMsgs(...miniStates)
        this.errorMsg = MiniStateUtility.combineErrorMsgs(...miniStates)
        this.data = MiniStateUtility.combineData(...miniStates)

        this.loading$ = MiniStateUtility.combineLoading$(...miniStates)
        this.error$ = MiniStateUtility.combineErrors$(...miniStates)
        this.successMsg$ = MiniStateUtility.combineSuccessMsgs$(...miniStates)
        this.errorMsg$ = MiniStateUtility.combineErrorMsgs$(...miniStates)
        this.data$ = MiniStateUtility.combineData$(...miniStates)
    }

    static Combine = (...miniStates: MiniState<any, any>[]) =>
        new MiniStateCombined(miniStates)

    static CombineLoaders = (...miniStates: MiniState<any, any>[]) =>
        MiniStateUtility.combineLoading(...miniStates)

    static CombineErrorMsgs = (...miniStates: MiniState<any, any>[]) =>
        MiniStateUtility.combineErrorMsgs(...miniStates)

    static CombineSuccessMsgs = (...miniStates: MiniState<any, any>[]) =>
        MiniStateUtility.combineSuccessMsgs(...miniStates)

    static CombineData = (...miniStates: MiniState<any, any>[]) =>
        MiniStateUtility.combineData(...miniStates)

    static CombineErrors = (...miniStates: MiniState<any, any>[]) =>
        MiniStateUtility.combineErrors(...miniStates)

}
