import { ThemeOption, ThemingConfig } from "@spider-baby/material-theming/config";

const today = new Date();
const thisYear = today.getFullYear();
const xmasTime = new Date(thisYear, 11, 1);
const halloweenTimeStart = new Date(thisYear, 10, 1);
const halloweenTimeEnd = new Date(thisYear, 11, 1);
export const IS_XMAS = today >= xmasTime;
export const IS_HALLOWEEN = today >= halloweenTimeStart && today < halloweenTimeEnd;
// export const IS_XMAS = true
// export const IS_HALLOWEEN = true




const _themeOptions: ThemeOption[] = [
  ThemeOption.create({
    darkMode: 'dark',
    label: 'Starry Night',
    value: 'starry-night',
    primaryColor: '#1E3A8A',
    secondaryColor: '#F0C420',
    tertiaryColor: '#8496B0', //(optional)
    errorColor: '#FF0000',//(optional)
  }),
  ThemeOption.create({
    darkMode: 'dark',
    label: 'Amethyst Sky', // Updated Label
    value: 'amethyst-sky', // Updated Value
    primaryColor: '#9B59B6', // Amethyst Purple
    secondaryColor: '#FAD7A0', // Pale Orange/Peach
    tertiaryColor: '#AED6F1', // Light Sky Blue
  }),
  ThemeOption.create({ // --- NO CHANGE ---
    darkMode: 'dark',
    label: 'Mint & Coral',
    value: 'mint-coral',
    primaryColor: '#4ECDC4', // Mint Green
    secondaryColor: '#FF6B6B', // Coral Red
    tertiaryColor: '#FFE66D', // Pastel Yellow
  }),
  ThemeOption.create({
    darkMode: 'dark',
    label: 'Forest Canopy', // Updated Label
    value: 'forest-canopy', // Updated Value
    primaryColor: '#1E4D2B', // Dark Forest Green
    secondaryColor: '#C8A951', // Old Gold
    tertiaryColor: '#D7CEC7', // Light Gray/Off-white
  }),
  ThemeOption.create({ // --- NO CHANGE ---
    darkMode: 'system',
    label: 'Sunset Glow',
    value: 'sunset-glow',
    primaryColor: '#FF4500', // Tangerine
    secondaryColor: '#FFD700', // Light Orange/Yellow
    tertiaryColor: '#FF69B4', // Watermelon Pink
  })
];

export const XMAS_THEME: ThemeOption = ThemeOption.create({
  darkMode: 'dark',
  label: 'Christmas', // Updated Label
  value: 'christmas', // Updated Value
  primaryColor: '#C8102E', // Crimson Red
  secondaryColor: '#006747', // White
  tertiaryColor: '#FFD700', // Gold
});

export const HALLOWEEN_THEME: ThemeOption = ThemeOption.create({
  darkMode: 'dark',
  label: 'Halloween', // Updated Label
  value: 'halloween', // Updated Value
  primaryColor: '#FF7518', // Near Black
  secondaryColor: '#31004a', // Pumpkin Orange
  tertiaryColor: '#1A1A1A', // Medium Purple
});

if (IS_XMAS) _themeOptions.push(XMAS_THEME);
if (IS_HALLOWEEN) _themeOptions.push(HALLOWEEN_THEME);

export const THEME_CONFIG = ThemingConfig.create({
  themeOptions: _themeOptions,
  defaultDarkModeType: 'dark',
  themeClassPrefix: 'my-app-theme',
  transitionOptions: {
    style: 'morph',
    // style: 'overlay',
    duration: 500,
    showTransitions: false,
  }
})