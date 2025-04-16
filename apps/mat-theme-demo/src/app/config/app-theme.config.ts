import { ThemeConfig, ThemeOption } from "@moonlight/ng/theming/config";

let today = new Date();
let thisYear = today.getFullYear();
let xmasTime = new Date(thisYear, 11, 1);
//  xmasTime = new Date(`${thisYear}-October-01`)
// export const IS_XMAS = today >= xmasTime;
export const IS_XMAS = true;
export const IS_EASTER = true;
export const IS_HALLOWEEN = true;


let idx = 1

const _themeOptions: ThemeOption[] = [
  {
    isDarkMode: false,
    label: 'Default',
    value: 'default',
    primaryColor: '#4682B4',
    secondaryColor: '#D2691E',
    classSuffix: 'default',
  },
  {
    isDarkMode: false,
    label: 'Violet and Lime', // Updated label
    value: 'violet-lime',    // Updated value
    primaryColor: '#8A2BE2',   // Blue Violet
    secondaryColor: '#32CD32', // Lime Green
    classSuffix: 2,
  },
];

export const XMAS_THEME: ThemeOption = {
  isDarkMode: false,
  label: 'Xmas',
  value: 'xmas',
  primaryColor: '#C8102E',
  secondaryColor: '#006747',
  // primaryColor: '#0f8a5f',
  // secondaryColor: '#f5624d',
  classSuffix: 'xmas',
};


export const EASTER_THEME: ThemeOption = {
  isDarkMode: false,
  label: 'Easter',
  value: 'easter',
  primaryColor: '#FFB7C5', // Light pink
  secondaryColor: '#FFDA61', // Deeper pastel yellow
  classSuffix: 'easter',
};


export const HALLOWEEN_THEME: ThemeOption = {
  isDarkMode: true,
  label: 'Halloween',
  value: 'halloween-theme',
  primaryColor: '#FF7518',
  secondaryColor: '#31004a',
  classSuffix: 'halloween',
};

if (IS_XMAS) _themeOptions.push(XMAS_THEME);
if (IS_EASTER) _themeOptions.push(EASTER_THEME);
if (IS_HALLOWEEN) _themeOptions.push(HALLOWEEN_THEME);

export const THEME_CONFIG = ThemeConfig.Create(_themeOptions);