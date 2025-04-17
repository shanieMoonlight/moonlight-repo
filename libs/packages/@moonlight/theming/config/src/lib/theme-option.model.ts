//##################################################//

/**
 * will be appened to the the`me class name.
 * Example class="theme-mysuffix0" 
*/
export type ThemeValue = string | number;

export const defaultThemeValue: ThemeValue = 'default';

//##################################################//

export class ThemeOption {

  /**Used for styling the GUI component to refelect your theme */
  primaryColor?: string

  /**Used for styling the GUI component to refelect your theme */
  secondaryColor?: string

  /**Start with dark mode? */
  fallbackIsDarkMode: boolean = false

  /**Display Name of the theme */
  label?: string

  /**Value associated with the theme */
  value: ThemeValue = defaultThemeValue

} //Cls

//##################################################//

export const defaultThemeOption: ThemeOption = {
  primaryColor: '#4682B4',
  secondaryColor: '#D2691E',
  fallbackIsDarkMode: false,
  label: 'Default',
  value: 'default',
}

//##################################################//