/**
 * @spider-baby/material-theming
 * 
 * This library uses secondary entry points to improve tree-shaking.
 * Please import specific components and services from the appropriate entry points:
 * 
 * - @spider-baby/material-theming/service - Core theme services
 * - @spider-baby/material-theming/components - Ready-to-use theme components
 * - @spider-baby/material-theming/config - Configuration types and utilities
 * - @spider-baby/material-theming/customizer - Theme selection components
 * - @spider-baby/material-theming/ui - UI elements for theme visualization
 * - @spider-baby/material-theming/utils - Helper utilities
 * - @spider-baby/material-theming/showcase - Components for showcasing themes
 * 
 * @example
 * ```typescript
 * // Good - specific imports
 * import { ThemeService } from '@spider-baby/material-theming/service';
 * import { ThemeOption } from '@spider-baby/material-theming/config';
 * 
 * // Bad - don't import from the main entry point
 * import { UseSecondaryEntryPoints } from '@spider-baby/material-theming';
 * ```
 */
export const UseSecondaryEntryPoints = 'Use Secondary Entry Points!!';