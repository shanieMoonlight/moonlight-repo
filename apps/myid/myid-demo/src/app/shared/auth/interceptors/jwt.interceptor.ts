import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { JwtStorageService } from '../services/jwt-storage/jwt-storage.service';

//###########################//

/** Type of token */
export const TOKEN_PREFIX = 'Bearer ' //the Space at the end is important
export const AUTH_HEADER = 'Authorization'

//###########################//

export const jwtInterceptorFn: HttpInterceptorFn = (req, next) => {

    const jwtStore = inject(JwtStorageService)
    const reqWithAuth = addAuthHeader(req, jwtStore)

    return next(reqWithAuth)
};


//---------------//


/**Adds the JWT (if there is one) to the Auth Header */
function addAuthHeader(request: HttpRequest<unknown>, jwtStore: JwtStorageService) {

    const accessToken = jwtStore.getStoredToken()

    if (!accessToken)
        return request;

    return request.clone({
        headers: request.headers.set(
            AUTH_HEADER,
            TOKEN_PREFIX + accessToken
        )
    })

} 
