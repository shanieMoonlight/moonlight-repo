import { ApiRouteData } from "@sb-hub/ui-cards/api";

export const API_ROUTES: ApiRouteData[] = [
  {
    title: 'Theme Service API',
    description: 'Comprehensive documentation of ThemeService methods and properties for managing themes in your application.',
    icon: 'palette',
    route: '/api/service-api',
    color: 'primary'
  },
  {
    title: 'CSS Variables',
    description: 'Complete list of CSS variables available in the theming system for customizing your application.',
    icon: 'code',
    route: '/api/variables-list',
    color: 'secondary'
  },
  {
    title: 'Theme Picker API',
    description: 'Documentation for the Theme Picker component, including examples and usage.',
    icon: 'palette',
    route: '/api/theme-picker-api',
    color: 'primary'
  },
  {
    title: 'Dark Mode Toggle API',
    description: 'Documentation for the Dark Mode Toggle component, including examples and usage.',
    icon: 'toggle_on',
    route: '/api/dark-mode-toggle-api',
    color: 'secondary'
  },
  {
    title: 'Apply Theme Directive API',
    description: 'Documentation for the Apply Theme directive, including examples and usage.',
    icon: 'brush',
    route: '/api/apply-theme-api',
    color: 'tertiary'
  },
  {
    title: 'Custom Theme Selector Component API',
    description: 'Documentation for the Custom Theme Selector Component including examples and usage.',
    icon: 'tune',
    route: '/api/custom-themes-api',
    color: 'primary'
  },
]