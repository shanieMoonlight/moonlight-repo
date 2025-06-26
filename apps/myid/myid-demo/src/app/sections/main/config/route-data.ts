import { ApiRouteData } from "@sb-hub/ui-cards/api";
import { AppRouteDefs } from "../../../app-route-defs";
export const MAIN_ROUTES: ApiRouteData[] = [
  {
    title: 'Login Jwt',
    description: 'Login and get a Json Web Token.',
    route: AppRouteDefs.fullPathsWithSlash.main.route('login-jwt'),
    icon: 'login',
    color: 'primary'
  },
  {
    title: 'Login Cookie',
    description: 'Login and get a Cookie.',
    route: AppRouteDefs.fullPathsWithSlash.main.route('login-cookie'),
    icon: 'cookie',
    color: 'secondary'
  },
  {
    title: 'Auth Info',
    description: 'View the decoded JWT and the Auth Service Props.',
    route: AppRouteDefs.fullPathsWithSlash.main.route('auth-test'),
    icon: 'quiz',
    color: 'tertiary'
  },
  {
    title: 'Change Password',
    description: 'Change your password.',
    route: AppRouteDefs.fullPathsWithSlash.main.route('change-pwd'),
    icon: 'change_circle',
    color: 'primary'
  },
  {
    title: 'Reset Password',
    description: 'Reset your password.',
    route: AppRouteDefs.fullPathsWithSlash.main.route('reset-password'),
    icon: 'refresh',
    color: 'secondary'
  },
  {
    title: 'Confirm Email',
    description: 'Confirm your email address.',
    route: AppRouteDefs.fullPathsWithSlash.main.route('confirm-email'),
    icon: 'alternate_email',
    color: 'tertiary'
  },
  {
    title: 'Confirm Email with Password',
    description: 'Confirm your email address with a password.',
    route: AppRouteDefs.fullPathsWithSlash.main.route('confirm-email-with-password'),
    icon: 'key',
    color: 'primary'
  },
  {
    title: 'Confirm Phone',
    description: 'Confirm your phone number.',
    route: AppRouteDefs.fullPathsWithSlash.main.route('confirm-phone'),
    icon: 'call',
    color: 'secondary'
  },
  {
    title: 'Verify 2-Factor',
    description: 'Verify 2 Factor Provider.',
    route: AppRouteDefs.fullPathsWithSlash.main.route('verify-2-factor'),
    icon: 'shield',
    color: 'tertiary'
  },
]