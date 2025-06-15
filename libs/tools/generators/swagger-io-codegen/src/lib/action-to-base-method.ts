import { Action } from "./models";


function hasParamaters(action: Action): boolean {
    return !!(action.params && action.params.length) || !!action.requestBodyType;
}

// - - - - - - - - - - - - -//

function getGetMethod(action: Action): string {

    if (!action.name) {
        return hasParamaters(action)
            ? '_getById'
            : '_get';
    }

    return hasParamaters(action)
        ? '_getActionById'
        : '_getAction';
}

// - - - - - - - - - - - - -//

function getPostMethod(action: Action): string {

    return !action.name
        ? '_post'
        : '_postAction';
}

// - - - - - - - - - - - - -//

function getPatchMethod(action: Action): string {

    return !action.name
        ? '_patch'
        : '_patchAction'
}

// - - - - - - - - - - - - -//

function getDeleteMethod(action: Action): string {
    return action.name
        ? '_deleteAction'
        : '_delete';
}

// - - - - - - - - - - - - -//





export function getBaseMethod(action: Action): string {
    // console.log(`getBaseMethod: ${action.method} - ${action.name}`);

    switch (action.method.toLocaleLowerCase()) {
        case 'post':
            return getPostMethod(action);
        case 'patch':
            return getPatchMethod(action);
        case 'delete':
            return getDeleteMethod(action);
        default:
            return getGetMethod(action);
    }
}