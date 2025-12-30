import { Signal, computed } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MiniState } from "../mini-state";
import { combineLatest, distinctUntilChanged, map, merge, Observable, of } from "rxjs";

export class MiniStateUtility {

    static combineErrors$ = (...miniStates: MiniState<any, any>[]): Observable<any> =>
        merge(...miniStates.map(st => st.error$))

    static combineErrors = (...miniStates: MiniState<any, any>[]): Signal<any> =>
        toSignal(this.combineErrors$(...miniStates))

    static combineErrorMsgs$ = (...miniStates: MiniState<any, any>[]): Observable<string | undefined> =>
        merge(...miniStates.map(st => st.errorMsg$))

    static combineErrorMsgs = (...miniStates: MiniState<any, any>[]): Signal<string | undefined> =>
        toSignal(this.combineErrorMsgs$(...miniStates))

    static combineSuccessMsgs$ = (...miniStates: MiniState<any, any>[]): Observable<string | undefined> =>
        merge(...miniStates.map(st => st.successMsg$))

    static combineSuccessMsgs = (...miniStates: MiniState<any, any>[]): Signal<string | undefined> =>
        toSignal(this.combineSuccessMsgs$(...miniStates))

    static combineLoading$(...miniStates: MiniState<any, any>[]): Observable<boolean> {
        const loadingObservables = miniStates.map(st => st.loading$);
        if (loadingObservables.length === 0)
            return of(false)

        return combineLatest(loadingObservables).pipe(
            map((loadings: boolean[]) => loadings.some(loading => loading === true)),
            distinctUntilChanged()
        );
    }

    static combineLoading = (...miniStates: MiniState<any, any>[]) =>
        computed(() => miniStates.map(st => st.loading())
            .reduce((acc, curr) => acc || curr, false)
        )

    static combineData$ = <T>(...miniStates: MiniState<any, T>[]): Observable<T | undefined> =>
        merge(...miniStates.map(st => st.data$))

    static combineData = <T>(...miniStates: MiniState<any, T>[]): Signal<T | undefined> =>
        toSignal(this.combineData$(...miniStates))

}
