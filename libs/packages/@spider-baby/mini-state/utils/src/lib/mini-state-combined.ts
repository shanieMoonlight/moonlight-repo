import { Signal } from "@angular/core";
import { MessageData, MiniState } from "@spider-baby/mini-state";
import { MsUtility } from "./mini-state-utility";

export class MiniStateCombined {

    readonly errorMsg: Signal<MessageData | undefined>   
    readonly error: Signal<any>                     
    readonly loading: Signal<boolean>               
    readonly successMsg: Signal<MessageData | undefined> 
    readonly data: Signal<any | undefined> 

    //-------------------------//    

    private constructor(miniStates: MiniState<any, any>[]) {
        this.loading = MsUtility.combineLoading(...miniStates)
        this.error = MsUtility.combineErrors(...miniStates)
        this.successMsg = MsUtility.combineSuccessMsgs(...miniStates)
        this.errorMsg = MsUtility.combineErrorMsgs(...miniStates)
        this.data = MsUtility.combineData(...miniStates)
    }

    //-------------------------//

    static Create = (...miniStates: MiniState<any, any>[]) =>
        new MiniStateCombined(miniStates)

    //- - - - - - - - - - - - -//    

    static CombineLoaders = (...miniStates: MiniState<any, any>[]) =>
        MsUtility.combineLoading(...miniStates)

    //- - - - - - - - - - - - -//    

    static CombineErrorMsgs = (...miniStates: MiniState<any, any>[]) =>
        MsUtility.combineErrorMsgs(...miniStates)

    //- - - - - - - - - - - - -//   

    static CombineSuccessMsgs = (...miniStates: MiniState<any, any>[]) =>
        MsUtility.combineSuccessMsgs(...miniStates)

    //- - - - - - - - - - - - -// 

    static CombineData = (...miniStates: MiniState<any, any>[]) =>
        MsUtility.combineData(...miniStates)

    //- - - - - - - - - - - - -//

    static CombineErrors = (...miniStates: MiniState<any, any>[]) =>
        MsUtility.combineErrors(...miniStates)

    //-------------------------//


}//Cls