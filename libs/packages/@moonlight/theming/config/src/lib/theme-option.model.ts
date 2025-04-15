export class ThemeOption {

  /**Used for styling the GUI component to refelect your theme */
  primaryColor?: string

  /**Used for styling the GUI component to refelect your theme */
  secondaryColor?: string

  /**Start with dark mode? */
  isDarkMode?: boolean
  
  /**Display Name of the theme */
  label?: string
  
  /**Value associated with the theme */
  value?: string

  /**Suffix for the class name , that will appear on the body html element*/
  classSuffix?: string | number = 0

} //Cls
