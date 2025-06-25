import { myIdDemoAuthInterceptorFn } from "./auth.interceptor";
import { jwtInterceptorFn } from "./jwt.interceptor";

export const authHttpInterceptors = [
  jwtInterceptorFn,
  myIdDemoAuthInterceptorFn
]