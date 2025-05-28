import { EnvironmentProviders, Provider } from "@angular/core";
import { TOAST_CONFIG_TOKEN, ToastConfig } from "./toast-config";

export class ToastSetup {

    static getProviders(config: ToastConfig = ToastConfig.Create()): (Provider | EnvironmentProviders)[] {

        return [
            {
                provide: TOAST_CONFIG_TOKEN,
                useValue: config,
            },
        ]

    } 


} //Cls