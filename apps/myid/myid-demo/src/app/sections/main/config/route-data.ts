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
    title: 'Example 3',
    description: 'Description for Example 3. Add your specific details here.',
    route: '/example_3',
    icon: 'edit_note',
    color: 'tertiary'
  },
  {
    title: 'Example 4',
    description: 'Description for Example 4. Add your specific details here.',
    route: '/example_4',
    icon: 'build',
    color: 'primary'
  },
  {
    title: 'Example 5',
    description: 'Description for Example 5. Add your specific details here.',
    route: '/example_5',
    icon: 'search',
    color: 'secondary'
  }
]