import { ApiRouteData } from "@sb-hub/ui-cards/api";
import { AppRouteDefs } from "../../../app-route-defs";
export const MAIN_ROUTES: ApiRouteData[] = [
  {
    title: 'Login Jwt',
    description: 'Login and get a Json Web Token.',
    route: AppRouteDefs.fullPathsWithSlash.main.account.route('login-jwt'),
    icon: 'login',
    color: 'primary'
  },
  {
    title: 'Login Cookie',
    description: 'Login and get a Cookie.',
    route: AppRouteDefs.fullPathsWithSlash.main.account.route('login-cookie'),
    icon: 'cookie',
    color: 'secondary'
  },
  {
    title: 'Auth Info',
    description: 'View the decoded JWT and the Auth Service Props.',
    route: AppRouteDefs.fullPathsWithSlash.main.route('auth-test-user-mgr-admin'),
    icon: 'quiz',
    color: 'tertiary'
  },
  {
    title: 'Change Password',
    description: 'Change your password.',
    route: AppRouteDefs.fullPathsWithSlash.main.account.route('change-password'),
    icon: 'change_circle',
    color: 'primary'
  },
  {
    title: 'Udpate 2-Factor',
    description: 'Udpate 2 Factor Provider.',
    route: AppRouteDefs.fullPathsWithSlash.main.account.route('update-2-factor'),
    icon: 'add_moderator',
    color: 'secondary'
  },
  {
    title: 'My Details',
    description: 'Update your info.',
    route: AppRouteDefs.fullPathsWithSlash.main.account.route('my-details'),
    icon: 'manage_accounts',
    color: 'tertiary'
  },
  {
    title: 'Mntc Team',
    description: 'Manage maintenance team.',
    route: AppRouteDefs.fullPathsWithSlash.main.account.route('mntc-team'),
    icon: 'handyman',
    color: 'primary'
  },
  {
    title: 'Super Team',
    description: 'Manage super team.',
    route: AppRouteDefs.fullPathsWithSlash.main.account.route('super-team'),
    icon: 'superscript',
    color: 'secondary'
  },
  {
    title: 'Customer List',
    description: 'View all customers.',
    route: AppRouteDefs.fullPathsWithSlash.main.account.route('customers'),
    icon: 'diversity_1',
    color: 'tertiary'
  },
  {
    title: 'Customer Regististration',
    description: 'Register.',
    route: AppRouteDefs.fullPathsWithSlash.main.account.route('register'),
    icon: 'how_to_reg',
    color: 'primary'
  },

  {
    title: 'Teams',
    description: 'View all the Customer/Mntc/Super Teams.',
    route: AppRouteDefs.fullPathsWithSlash.main.account.route('teams'),
    icon: 'diversity_3',
    color: 'secondary'
  },
  {
    title: 'Reset Password',
    description: 'Reset your password. \nWill error without query params.',
    route: AppRouteDefs.fullPathsWithSlash.main.account.route('reset-password'),
    icon: 'refresh',
    color: 'tertiary'
  },
  {
    title: 'Confirm Email',
    description: 'Confirm your email address. \nWill error without query params.',
    route: AppRouteDefs.fullPathsWithSlash.main.account.route('confirm-email'),
    icon: 'alternate_email',
    color: 'primary'
  },
  {
    title: 'Confirm Email with Password',
    description: 'Confirm your email address with a password. \nWill error without query params.',
    route: AppRouteDefs.fullPathsWithSlash.main.account.route('confirm-email-with-password'),
    icon: 'key',
    color: 'secondary'
  },
  {
    title: 'Confirm Phone',
    description: 'Confirm your phone number. \nWill error without query params.',
    route: AppRouteDefs.fullPathsWithSlash.main.account.route('confirm-phone'),
    icon: 'call',
    color: 'tertiary'
  },
  {
    title: 'Verify 2-Factor',
    description: 'Verify 2 Factor Provider. \nWill error without query params.',
    route: AppRouteDefs.fullPathsWithSlash.main.account.route('verify-2-factor'),
    icon: 'shield',
    color: 'primary'
  },
]
