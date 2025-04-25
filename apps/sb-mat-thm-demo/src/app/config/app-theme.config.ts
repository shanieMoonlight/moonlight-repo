import { ThemeOption, ThemingConfig } from "@spider-baby/material-theming/config";

const today = new Date();
const thisYear = today.getFullYear();
const xmasTime = new Date(thisYear, 11, 1);
const halloweenTimeStart = new Date(thisYear, 10, 1);
const halloweenTimeEnd = new Date(thisYear, 11, 1);
export const IS_XMAS = today >= xmasTime;
export const IS_HALLOWEEN = today >= halloweenTimeStart && today < halloweenTimeEnd;




const _themeOptions: ThemeOption[] = [
  ThemeOption.create({
    defaultDarkMode: 'system',
    label: 'Default',
    value: 'default',
    primaryColor: '#4682B4',
    secondaryColor: '#D2691E',
    tertiaryColor: '#8B0000', //(optional)
    errorColor: '#FF0000',//(optional)
  }),
  ThemeOption.create({
    defaultDarkMode: 'light',
    label: 'Violet and Lime',
    value: 'violet-lime',
    primaryColor: '#8A2BE2',
    secondaryColor: '#32CD32',
  }),
  ThemeOption.create({
    defaultDarkMode: 'light',
    label: 'Pastel',
    value: 'pastel',
    primaryColor: '#FFB7C5', // Light pink
    secondaryColor: '#FFDA61', // Deeper pastel yellow
  })  ,
    ThemeOption.create({
      defaultDarkMode: 'dark',
      label: 'Deep Ocean',
      value: 'deep-ocean',
      primaryColor: '#1E3A8A', // Deep blue
      secondaryColor: '#06B6D4', // Cyan
    }),
    ThemeOption.create({
      defaultDarkMode: 'light',
      label: 'Cherry Blossom',
      value: 'cherry-blossom',
      primaryColor: '#EC4899', // Pink
      secondaryColor: '#84CC16', // Lime green
    })
];

export const XMAS_THEME: ThemeOption = ThemeOption.create({
  defaultDarkMode: 'light',
  label: 'Xmas',
  value: 'xmas',
  primaryColor: '#C8102E',
  secondaryColor: '#006747',
});

export const HALLOWEEN_THEME: ThemeOption = ThemeOption.create({
  defaultDarkMode: 'dark',
  label: 'Halloween',
  value: 'halloween-theme',
  primaryColor: '#FF7518',
  secondaryColor: '#31004a',
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

