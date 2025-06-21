import { jwtInterceptorFn } from "./jwt.interceptor";

export const idHttpInterceptors = [
  jwtInterceptorFn,
]