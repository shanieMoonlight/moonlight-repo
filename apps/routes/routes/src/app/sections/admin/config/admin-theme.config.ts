import { ThemeOption, ThemingConfig } from "@spider-baby/material-theming/config";


/**
 * Default theme option for the homepage
 */
// export const DEFAULT_SEAONAL_THEME = ThemeOption.create({
//   darkMode: 'light',
//   label: 'Seasons Home',
//   value: 'seasonal-default',
//   primaryColor: '#673AB7', // Deep Purple
//   secondaryColor: '#FFD740', // Amber accent
//   tertiaryColor: '#00BCD4', // Cyan
// });

export const DEFAULT_ADMIN_THEME = ThemeOption.create({
  darkMode: 'light',
  label: 'Admin',
  value: 'admin-default',
  primaryColor: '#810081', 
  secondaryColor: '#7F00FF', 
  tertiaryColor: '#CAFFD0', 
});

export const ADMIN_2_THEME = ThemeOption.create({
  darkMode: 'light',
  label: 'Blossom',
  value: 'blossom',
  primaryColor: '#FFC0CB', // Pink
  secondaryColor: '#FFD700', // Gold
  tertiaryColor: '#98FB98', // Pale Green
})

export const ADMIN_3_THEME = ThemeOption.create({
  darkMode: 'light',
  label: 'Sky Blue',
  value: 'sky-blue',
  primaryColor: '#57C4E5',    
  secondaryColor: '#F97068',  
  tertiaryColor: '#351431',   
})


export const ADMIN_THEME_OPTIONS: ThemeOption[] = [
  DEFAULT_ADMIN_THEME,
  ADMIN_2_THEME,
  ADMIN_3_THEME
];


export const ADMIN_THEME_CONFIG = ThemingConfig.create({
  themeOptions: ADMIN_THEME_OPTIONS,
  defaultDarkModeType: 'dark',
  themeClassPrefix: 'my-app-theme',
  transitionOptions:{
    style: 'morph',
    duration: 500,
    showTransitions: true,  }
})



