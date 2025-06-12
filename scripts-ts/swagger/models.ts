// Types matching your controller-example.ts
export type ParamInputMethod = 'body' | 'query' | 'path' | 'header' | 'formData';

export interface Paramater{
    name:string;
    type: string;
    format?: string;
}

export interface Action {
    name: string;
    method: string;
    paramType: ParamInputMethod;
    params?: Paramater[];
    description?: string;
    bodyparam?: any;
}

export interface ControllerDefinition {
    name: string;
    description?: string;
    actions: Action[];
}