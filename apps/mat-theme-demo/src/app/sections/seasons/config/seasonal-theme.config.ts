import { ThemeOption, ThemingConfig } from "@moonlight/material/theming/config";




export const  SPRING_THEME = ThemeOption.create({
  darkMode: false,
  label: 'Spring',
  value: 'spring',
  primaryColor: '#8BC34A', // Fresh green
  secondaryColor: '#FFEB3B', // Bright yellow
  tertiaryColor: '#FF4081', // Pink blossom
})
export const  SUMMER_THEME = ThemeOption.create({
  darkMode: false,
  label: 'Summer',
  value: 'summer',
  primaryColor: '#03A9F4', // Sky blue
  secondaryColor: '#FF9800', // Warm orange
  tertiaryColor: '#4CAF50', // Vibrant green
})
export const  AUTUMN_THEME = ThemeOption.create({
  darkMode: false,
  label: 'Autumn',
  value: 'autumn',
  primaryColor: '#FF5722', // Sunset orange
  secondaryColor: '#FFC107', // Golden yellow
  tertiaryColor: '#191102', // Lime green
})
export const  WINTER_THEME = ThemeOption.create({
  darkMode: false,
  label: 'Winter',
  value: 'winter',
  primaryColor: '#1E88E5', // Ice blue
  secondaryColor: '#E0E0E0', // Silver/snow
  tertiaryColor: '#263238', // Dark blue-gray
})




const _themeOptions: ThemeOption[] = [
  SPRING_THEME,
  SUMMER_THEME,
  AUTUMN_THEME,
  WINTER_THEME,
];


export const SEASON_THEME_CONFIG = ThemingConfig.create({
  themeOptions: _themeOptions,
  defaultMode: 'dark',
  themeClassPrefix: 'my-app-theme',
  transitionOptions:{
    style: 'morph',
    duration: 500,
    showTransitions: true,  }
})



