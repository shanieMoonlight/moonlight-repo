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
    fallbackIsDarkMode: false,
    label: 'Default',
    value: 'default',
    primaryColor: '#4682B4',
    secondaryColor: '#D2691E',
    // classSuffix: 'default',
  },
  {
    fallbackIsDarkMode: false,
    label: 'Violet and Lime',  
    value: 'violet-lime',      
    primaryColor: '#8A2BE2',   
    secondaryColor: '#32CD32', 
    // classSuffix: 2,
  },
];

export const XMAS_THEME: ThemeOption = {
  fallbackIsDarkMode: false,
  label: 'Xmas',
  value: 'xmas',
  primaryColor: '#C8102E',
  secondaryColor: '#006747',
  // classSuffix: 'xmas',
};


export const EASTER_THEME: ThemeOption = {
  fallbackIsDarkMode: false,
  label: 'Easter',
  value: 'easter',
  primaryColor: '#FFB7C5', // Light pink
  secondaryColor: '#FFDA61', // Deeper pastel yellow
  // classSuffix: 'easter',
};


export const HALLOWEEN_THEME: ThemeOption = {
  fallbackIsDarkMode: true,
  label: 'Halloween',
  value: 'halloween-theme',
  primaryColor: '#FF7518',
  secondaryColor: '#31004a',
  // classSuffix: 'halloween',
};

if (IS_XMAS) _themeOptions.push(XMAS_THEME);
if (IS_EASTER) _themeOptions.push(EASTER_THEME);
if (IS_HALLOWEEN) _themeOptions.push(HALLOWEEN_THEME);

export const THEME_CONFIG = ThemeConfig.Create(_themeOptions);