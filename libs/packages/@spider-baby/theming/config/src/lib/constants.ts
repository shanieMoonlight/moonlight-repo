/**
    Different levels of color shades. for primary, secondary, tertiary, error, neutral.
    Examples: color-primary-50, color-primary-100, color-primary-200, etc.
    The numbers represent the shade level, with 0 being the lightest and 100 being the darkest.
 */
export const DEFAULT_COLOR_TONES = [0, 4, 6, 10, 12, 17, 20, 22, 24, 25, 30, 35, 40, 50, 60, 70, 80, 87, 90, 92, 94, 95, 96, 98, 99, 100];


//==============================================//
// Color constants


/**
 * Default primary color used when no custom theme is specified.
 * Steel blue (#4682B4).
 */
export const DEFAULT_COLOR_PRIMARY = '#4682B4';

/**
 * Default secondary color used when no custom theme is specified.
 * Chocolate (#D2691E).
 */
export const DEFAULT_COLOR_SECONDARY = '#D2691E';

/**
 * Default tertiary color used when no custom theme is specified.
 * Rose pink (#B58392).
 */
export const DEFAULT_COLOR_TERTIARY = '#B58392';

/**
 * Default error color used across themes.
 * Material Design's standard error color (#B3261E).
 */
export const DEFAULT_COLOR_ERROR = '#B3261E';

/**
 * Default neutral color used for backgrounds and surfaces in light mode.
 * Very light gray (#F5F5F5).
 */
export const DEFAULT_COLOR_NEUTRAL = '#F5F5F5';


//==============================================//
//ThemeOption constants


/**
 * Default value identifier used for the default theme.
 */
export const DEFAULT_THEME_VALUE = 'Default';

/**
 * Default display label for the default theme.
 */
export const DEFAULT_THEME_LABEL = 'default';


//==============================================//
//Styling constants

/**
 * CSS class applied to the document when dark mode is active.
 */
export const DARK_MODE_CLASS = 'dark-mode';

/**
 * CSS class applied to the document when light mode is active.
 */
export const LIGHT_MODE_CLASS = 'light-mode';

/**
 * Prefix used for theme-specific CSS classes.
 * Theme classes follow the pattern: `${THEME_CLASS_PREFIX}-${themeValue}`.
 */
export const THEME_CLASS_PREFIX = 'sb-theme';

/**
 * Prefix used for color CSS variables.
 * Color variables follow the pattern: `--${COLOR_VAR_PREFIX}-${colorName}-${toneLevel}`.
 */
export const COLOR_VAR_PREFIX = 'mat-sys';

/**
 * SCSS variable name used to store the color palettes map.
 * Used for SCSS integration with the theme system.
 */
export const PALETTES_MAP_SCSS_VAR = '$palettes';



