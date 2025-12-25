import { ServiceProperty } from "./api-doc-models";

export const THEME_SERVICE_METHODS: ServiceProperty[] = [
    {
      name: 'setTheme',
      type: '(theme: ThemeOption) => void',
      description: 'Sets the current theme based on the provided ThemeOption object.',
      example: `// Set a theme using a ThemeOption object
const myTheme = themeService.availableThemes().find(t => t.label === 'Ocean Blue');
if (myTheme) {
  themeService.setTheme(myTheme);
}`
    },
    {
      name: 'setThemeByValue',
      type: '(themeValue: ThemeValue) => boolean',
      description: 'Sets the current theme by its identifier value. Returns true if successful.',
      example: `// Set a theme by its value
const success = themeService.setThemeByValue('material-light')
if (success) {
  console.log('Theme applied successfully')
} else {
  console.warn('Theme not found')
}`,
    },
    {
      name: 'setDarkMode',
      type: '(darkMode: DarkModeType | null | undefined) => void',
      description: "Sets the application's light/dark mode. Use 'light', 'dark', or 'system'.",
      example: `// Set dark mode explicitly
themeService.setDarkMode('dark')

// Follow system preference
themeService.setDarkMode('system')

// Set light mode
themeService.setDarkMode('light')`,
    },
    {
      name: 'applyTheme',
      type: '(theme: ThemeOption, targetElement?: HTMLElement) => void',
      description: 'Applies a theme to the document or a specific element. Useful for local theming.',
      example:  `// Apply theme to a specific element
      const cardElement = document.querySelector('.my-card')
      const myTheme = themeService.currentTheme()
      themeService.applyTheme(myTheme, cardElement)`,
    },
    {
      name: 'addCustomTheme',
      type: '(theme: ThemeOption) => ThemeOption[]',
      description: 'Adds a custom theme to the list of available themes.',
      example:  `// Create and add a custom theme
      import { ThemeOption } from '@spider-baby/material-theming/config'
      
      const myCustomTheme = ThemeOption.create({
        value: 'custom-purple',
        label: 'Purple Theme',
        primaryColor: '#6200EA',
        secondaryColor: '#03DAC6'
      })
      
      themeService.addCustomTheme(myCustomTheme)`,
    },
    {
      name: 'removeCustomTheme',
      type: '(value: ThemeValue) => ThemeOption[]',
      description: 'Removes a custom theme by its value.',
      example: `// Remove a custom theme
themeService.removeCustomTheme('custom-purple')`,
    },
    {
      name: 'refreshTheme',
      type: '() => void',
      description: 'Refreshes the theme by reapplying stored theme data.. Useful after temporarily previewing other themes.',
      example: `// In a component that temporarily previews themes
ngOnDestroy() {
  // Restore the application's theme when this component is destroyed
  this.themeService.refreshTheme()
}`,
    },
    {
      name: 'resetToDefaults',
      type: '() => void',
      description: 'Resets all theme settings to system defaults and clears custom themes.',
      example:  `// Reset everything to defaults
      themeService.resetToDefaults()`,
    },
    {
      name: 'exportThemeSettings',
      type: '() => { theme: ThemeOption, isDark: boolean }',
      description: 'Exports the current theme settings as a serializable object.',
      example: `// Export settings for sharing or saving
const settings = themeService.exportThemeSettings()
console.log(settings)
// Example output: { theme: {...}, isDark: true }`,
    },
  ];
  