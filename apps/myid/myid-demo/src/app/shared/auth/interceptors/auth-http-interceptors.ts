import { myIdDemoAuthInterceptorFn } from "./auth.interceptor";
import { jwtInterceptorFn } from "@spider-baby/auth-jwt-utils/interceptor";

export const authHttpInterceptors = [
  jwtInterceptorFn,
  myIdDemoAuthInterceptorFn
]