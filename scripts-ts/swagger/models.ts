// Types matching your controller-example.ts
export type ParamInputMethod = 'body' | 'query' | 'path' | 'header' | 'formData';

export interface Paramater {
    name: string;
    type: string;
    format?: string;
}
export interface ResponseBody {
    type: string;
    isArray?: boolean;
}

export interface Action {
    name?: string;
    method: string;
    paramType: ParamInputMethod;
    params?: Paramater[];
    description?: string;
    requestBodyType?: string;
    responseBody?: ResponseBody;
}

export interface ControllerDefinition {
    name: string;
    description?: string;
    actions: Action[];
}

// ################################//

export interface SwgJsonParamaterSchema {
    type?: string;
    format?: string
}

export interface SwgJsonActionParamter {
    name?: string;
    schema?: SwgJsonParamaterSchema
}


// ################################//