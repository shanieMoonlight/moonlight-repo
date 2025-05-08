import { ServiceProperty } from "./api-doc-models";

export const THEME_SERVICE_PROPERTIES: ServiceProperty[] = [
  {
    name: 'currentTheme',
    type: 'Signal<ThemeOption>',
    description: 'A signal that provides the current active theme.',
    example: `// In a component that temporarily previews themes
ngOnDestroy() {
  // Restore the application's theme when this component is destroyed
  this.themeService.reapplyCurrentTheme()
}`,
  },
  {
    name: 'currentTheme$',
    type: 'Observable<ThemeOption>',
    description: 'An observable that provides the current active theme.',
    example:  `// Subscribe to theme changes
    themeService.currentTheme$.subscribe(theme => {
      console.log('Theme changed:', theme.label)
    })`,
  },
  {
    name: 'isDarkMode',
    type: 'Signal<boolean>',
    description: 'A signal that indicates whether dark mode is currently active.',
    example: `// Check if dark mode is active
const isDark = themeService.isDarkMode()
console.log('Dark mode is:', isDark ? 'on' : 'off')`,
  },
  {
    name: 'isDarkMode$',
    type: 'Observable<boolean>',
    description: 'An observable that emits whether dark mode is currently active.',
    example: `// Subscribe to isDarkMode changes
themeService.isDarkMode$.subscribe(isDark => {
  console.log('Dark mode value:', isDark)
})`,
  },
  {
    name: 'availableThemes',
    type: 'Signal<ThemeOption[]>',
    description: 'A signal that provides all available themes (system and custom).',
    example: `// Get all available themes
const themes = themeService.availableThemes()
console.log(\`\${themes.length} themes available\`)`,
  },
  {
    name: 'availableThemes$',
    type: 'Observable<ThemeOption[]>',
    description: 'An observable that emits all available themes (system and custom).',
    example: `// Subscribe to all available themes
themeService.availableThemes$.subscribe(themes => {
console.log(\`\${themes.length} themes available\`)
})`,
  },
  {
    name: 'darkModeType',
    type: 'Signal<DarkModeType>',
    description: 'A signal that provides the current dark mode type ("light", "dark", or "system").',
    example: `// Get the current dark mode type
const mode = themeService.darkModeType()
console.log('Dark mode type:', mode)`,
  },
  {
    name: 'darkModeType$',
    type: 'Observable<DarkModeType>',
    description: 'An observable that emits the current dark mode type ("light", "dark", or "system").',
    example: `// Subscribe to dark mode type changes
themeService.darkModeType$.subscribe(mode => {
  console.log('Dark mode type changed:', mode)
})`,
  },
  {
    name: 'customThemes',
    type: 'Signal<ThemeOption[]>',
    description: 'A signal that provides the list of custom themes added by the user.',
    example: `// Get all custom themes
const customThemes = themeService.customThemes()
console.log('Custom themes:', customThemes)`,
  },
  {
    name: 'customThemes$',
    type: 'Observable<ThemeOption[]>',
    description: 'An observable that emits the list of custom themes added by the user.',
    example: `// Subscribe to custom theme changes
themeService.customThemes$.subscribe(themes => {
  console.log('Custom themes updated:', themes)
})`,
  },
  {
    name: 'systemThemes',
    type: 'Signal<ThemeOption[]>',
    description: 'A signal that provides the list of system (built-in) themes.',
    example: `// Get all system themes
const systemThemes = themeService.systemThemes()
console.log('System themes:', systemThemes)`,
  },
  {
    name: 'systemThemes$',
    type: 'Observable<ThemeOption[]>',
    description: 'An observable that emits the list of system (built-in) themes.',
    example: `// Subscribe to system theme changes
themeService.systemThemes$.subscribe(themes => {
  console.log('System themes updated:', themes)
})`,
  },
]