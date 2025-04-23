/**
 * @moonlight/material/theming
 * 
 * This library uses secondary entry points to improve tree-shaking.
 * Please import specific components and services from the appropriate entry points:
 * 
 * - @moonlight/material/theming/service - Core theme services
 * - @moonlight/material/theming/components - Ready-to-use theme components
 * - @moonlight/material/theming/config - Configuration types and utilities
 * - @moonlight/material/theming/customizer - Theme selection components
 * - @moonlight/material/theming/ui - UI elements for theme visualization
 * - @moonlight/material/theming/utils - Helper utilities
 * - @moonlight/material/theming/showcase - Components for showcasing themes
 * 
 * @example
 * ```typescript
 * // Good - specific imports
 * import { ThemeService } from '@moonlight/material/theming/service';
 * import { ThemeOption } from '@moonlight/material/theming/config';
 * 
 * // Bad - don't import from the main entry point
 * import { UseSecondaryEntryPoints } from '@moonlight/material/theming';
 * ```
 */
export const UseSecondaryEntryPoints = 'Use Secondary Entry Points!!';