import { ApiRouteData } from "@spider-baby/ui-cards/api";

export const API_ROUTES: ApiRouteData[] = [
  {
    title: 'MiniState',
    description: 'Core class for managing async operations with automatic handling of loading states, errors, and success messages.',
    icon: 'change_history',
    route: '/api/mini-state',
    color: 'primary'
  },
  {
    title: 'MiniStateBuilder',
    description: 'Factory for creating MiniState instances for common async operation patterns including reactive inputs.',
    icon: 'construction',
    route: '/api/mini-state-builder',
    color: 'secondary'
  },
  {
    title: 'MiniCrudState',
    description: 'Extended MiniState for streamlined CRUD operations with automatic client-side data updates.',
    icon: 'table_view',
    route: '/api/mini-state-crud',
    color: 'tertiary'
  },
  {
    title: 'MiniStateCombined',
    description: 'Utility for combining multiple MiniState instances for unified loading, error, and success handling.',
    icon: 'merge_type',
    route: '/api/mini-state-combined',
    color: 'primary'
  },
  {
    title: 'MiniStateUtility',
    description: 'Helper methods for working with multiple MiniState instances and combining their signals/observables.',
    icon: 'handyman',
    route: '/api/mini-state-utility',
    color: 'secondary'
  }
]