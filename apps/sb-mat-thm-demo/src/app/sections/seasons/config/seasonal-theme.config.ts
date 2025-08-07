import { ThemeOption, ThemingConfig } from "@spider-baby/material-theming/config";


/**
 * Default theme option for the homepage
 */
export const DEFAULT_SEAONAL_THEME = ThemeOption.create({
  darkMode: 'light',
  label: 'Seasons Home',
  value: 'seasonal-default',
  primaryColor: '#673AB7', // Deep Purple
  secondaryColor: '#FFD740', // Amber accent
  tertiaryColor: '#00BCD4', // Cyan
});

export const  SPRING_THEME = ThemeOption.create({
  darkMode: 'light',
  label: 'Spring',
  value: 'spring',
  primaryColor: '#8BC34A', // Fresh green
  secondaryColor: '#FFEB3B', // Bright yellow
  tertiaryColor: '#FF4081', // Pink blossom
})

export const SUMMER_THEME = ThemeOption.create({
  darkMode: 'light',
  label: 'Summer',
  value: 'summer',
  primaryColor: '#ff598f',    
  secondaryColor: '#20A4F3',  
  tertiaryColor: '#EC7D10',   
})

export const  AUTUMN_THEME = ThemeOption.create({
  darkMode: 'light',
  label: 'Autumn',
  value: 'autumn',
  primaryColor: '#FF5722', // Sunset orange
  secondaryColor: '#FFC107', // Golden yellow
  tertiaryColor: '#191102', // Lime green
})
export const  WINTER_THEME = ThemeOption.create({
  darkMode: 'light',
  label: 'Winter',
  value: 'winter',
  primaryColor: '#1E88E5', // Ice blue
  secondaryColor: '#E0E0E0', // Silver/snow
  tertiaryColor: '#263238', // Dark blue-gray
})


export const SEASON_THEME_OPTIONS: ThemeOption[] = [
  DEFAULT_SEAONAL_THEME,
  SPRING_THEME,
  SUMMER_THEME,
  AUTUMN_THEME,
  WINTER_THEME,
];


export const SEASON_THEME_CONFIG = ThemingConfig.create({
  themeOptions: SEASON_THEME_OPTIONS,
  defaultDarkModeType: 'dark',
  themeClassPrefix: 'my-app-theme',
  darkModeClass: 'my-dark-mode',
  transitionOptions:{
    style: 'morph',
    duration: 500,
    showTransitions: true,  }
})



