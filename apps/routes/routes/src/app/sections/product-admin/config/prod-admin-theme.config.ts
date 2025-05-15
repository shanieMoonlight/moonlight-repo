import { ThemeOption, ThemingConfig } from "@spider-baby/material-theming/config";


/**
 * Default theme option for the homepage
 */

export const PROD_ADMIN_DEFAULT_THEME = ThemeOption.create({
  darkMode: 'dark',
  label: 'Prod Admin',
  value: 'prod-admin-default',
  primaryColor: '#212121', // Dark Gray
  secondaryColor: '#FFC107', // Amber
  tertiaryColor: '#00BCD4', // Cyan
});

export const PROD_ADMIN_2_THEME = ThemeOption.create({
  darkMode: 'light',
  label: 'Violet',
  value: 'violet',
  primaryColor: '#3F51B5', // Indigo
  secondaryColor: '#FF9800', // Orange
  tertiaryColor: '#4CAF50', // Green
});

const _themeOptions: ThemeOption[] = [
  PROD_ADMIN_DEFAULT_THEME,
  PROD_ADMIN_2_THEME,
  PROD_ADMIN_2_THEME,
];

export const PROD_ADMIN_THEME_CONFIG = ThemingConfig.create({
  themeOptions: _themeOptions,
  defaultDarkModeType: 'light',
  themeClassPrefix: 'product-admin-theme',
  transitionOptions: {
    style: 'morph',
    duration: 300,
    showTransitions: true,
  },
});



