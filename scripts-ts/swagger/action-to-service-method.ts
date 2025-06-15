import { getBaseMethod } from './action-to-base-method';
import { Action, Paramater } from "./models";
import { SwgSConstants } from './swg-constants';
import { SwgStringUtils } from './swg-string-utils';

// ################################//

interface MethodParamInfo {
    name: string;
    type: string;
}

// ################################//

function getTypeScriptParamType(param: Paramater): string {

    switch (param.type) {
        case 'integer':
        case 'number':
            return 'number';
        case 'boolean':
            return 'boolean';
        case 'string':
            if (param.format === 'date-time' || param.format === 'date')
                return 'string';
            return 'string';
        default:
            return param.type || 'any';
    }
}

// - - - - - - - - - - - - - - - - //

function generateMethodParams(action: Action): MethodParamInfo[] {
    const requestBodyType = action.requestBodyType
    if (requestBodyType)
        return [{
            name: SwgSConstants.dtoName,
            type: requestBodyType
        }]

    if (!action.params?.length)
        return []

    return action.params.map(param => {
        return {
            name: param.name,
            type: getTypeScriptParamType(param)
        };

    })

}

// - - - - - - - - - - - - - - - - //

function generateServiceReturnType(action: Action): string {
    const responseBody = action.responseBody
    if (!responseBody || !responseBody.type)
        return 'any'

    return responseBody.isArray
        ? `${responseBody.type}[]`
        : responseBody.type;
}

// - - - - - - - - - - - - - - - - //

/**
 * Builds a service method string for an action with a request body.
 */
export function actionToServiceMethod(action: Action, controllerName: string, serverRoutesClass: string) {

    const methodName = SwgStringUtils.toCamelCase(action.name || action.method.toLowerCase());
    const responseType = generateServiceReturnType(action)
    const baseMethod = getBaseMethod(action);
    const actionName = action.name//|| action.method.toLowerCase();
    const methodParams = generateMethodParams(action)

    console.log(`Generating service method for action: ${controllerName}/${actionName} with params: ${JSON.stringify(methodParams, null, 2)}`);


    const methodInputParams = methodParams
        .map(param => `${param.name}: ${param.type}`)
        .join(', ');

    const baseMethodInputParams = methodParams
        .map(param => param.name)
        .join(', ');

    const actionParam = actionName
        ? `
            ${serverRoutesClass}.${SwgStringUtils.capitalize(controllerName)}.action('${SwgStringUtils.toCamelCase(actionName)}'),`
        : '';

    if (!methodParams.length) {
        return `\n  
    ${methodName} = (opts?: unknown): Observable<${responseType}> =>
        this.${baseMethod}<${responseType}>(${actionParam}
            opts ?? {}
        );
    `;

    }

    return `\n  
    ${methodName} = (${methodInputParams}, opts?: unknown): Observable<${responseType}> =>
        this.${baseMethod}<${responseType}>(${actionParam}
           ${baseMethodInputParams},
           opts ?? {}
        );
    `;
}
