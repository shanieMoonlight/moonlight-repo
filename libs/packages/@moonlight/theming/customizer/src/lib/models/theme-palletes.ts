/**
 * Represents the complete set of color palettes generated from theme base colors.
 * Each palette contains a record of tone values (0-100) mapped to hex color values.
 * 
 * These palettes are used to create a comprehensive color system according to 
 * Material Design 3 guidelines, with shades for use in different contexts.
 */
export interface GeneratedPalettes {
  /**
   * Primary color palette - the main brand color used across the UI
   */
  primary: Record<number, string>;
  
  /**
   * Secondary color palette - used for less prominent components
   */
  secondary: Record<number, string>;
  
  /**
   * Tertiary color palette - used for distinguishing sections or for accent elements
   */
  tertiary: Record<number, string>;
  
  /**
   * Error color palette - used for error states, validation, and destructive actions
   */
  error: Record<number, string>;
  
  /**
   * Neutral color palette - used for backgrounds, surfaces, and standard text
   */
  neutral: Record<number, string>;
  
  /**
   * Neutral variant palette - used for surface variants and medium-emphasis text
   */
  'neutral-variant': Record<number, string>;
}