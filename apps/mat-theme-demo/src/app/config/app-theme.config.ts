import { ThemeConfig, ThemeOption } from "@moonlight/material/theming/config";

const today = new Date();
const thisYear = today.getFullYear();
const xmasTime = new Date(thisYear, 11, 1);
// const xmasTime = new Date(`${thisYear}-October-01`)
// export const IS_XMAS = true;
export const IS_XMAS = today >= xmasTime;
export const IS_HALLOWEEN = true;

const _themeOptions: ThemeOption[] = [
  ThemeOption.create({
    darkMode: 'system',
    label: 'Default',
    value: 'default',
    primaryColor: '#4682B4',
    secondaryColor: '#D2691E',
  }),
  ThemeOption.create({
    darkMode: false,
    label: 'Violet and Lime',
    value: 'violet-lime',
    primaryColor: '#8A2BE2',
    secondaryColor: '#32CD32',
  }),
  ThemeOption.create({
    darkMode: false,
    label: 'Pastel',
    value: 'pastel',
    primaryColor: '#FFB7C5', // Light pink
    secondaryColor: '#FFDA61', // Deeper pastel yellow
  })
];

export const XMAS_THEME: ThemeOption = ThemeOption.create({
  darkMode: false,
  label: 'Xmas',
  value: 'xmas',
  primaryColor: '#C8102E',
  secondaryColor: '#006747',
});

export const HALLOWEEN_THEME: ThemeOption = ThemeOption.create({
  darkMode: true,
  label: 'Halloween',
  value: 'halloween-theme',
  primaryColor: '#FF7518',
  secondaryColor: '#31004a',
});

if (IS_XMAS) _themeOptions.push(XMAS_THEME);
if (IS_HALLOWEEN) _themeOptions.push(HALLOWEEN_THEME);

export const THEME_CONFIG = ThemeConfig.create(_themeOptions);






// const today = new Date();
// const thisYear = today.getFullYear();
// const xmasTime = new Date(thisYear, 11, 1);
// const halloweenTimeStart = new Date(thisYear, 10, 1);
// const halloweenTimeEnd = new Date(thisYear, 11, 1);
// export const IS_XMAS = today >= xmasTime;
// export const IS_HALLOWEEN = today >= halloweenTimeStart && today < halloweenTimeEnd;


// const _themeOptions: ThemeOption[] = [
//   ThemeOption.create({
//     value: 'ocean-blue', 
//     label: 'Ocean Blue', 
//     primaryColor: '#0277BD', 
//     secondaryColor: '#26A69A' 
//   }),
//   ThemeOption.create({
//     darkMode: false,
//     label: 'Violet and Lime',
//     value: 'violet-lime',
//     primaryColor: '#8A2BE2',
//     secondaryColor: '#32CD32',
//   }),
//   ThemeOption.create({
//     value: 'sunset-orange', 
//     label: 'Sunset Orange', 
//     primaryColor: '#FF5722', 
//     secondaryColor: '#FFC107' 
//   })
// ];

// export const XMAS_THEME: ThemeOption = ThemeOption.create({
//   darkMode: false,
//   label: 'Xmas',
//   value: 'xmas',
//   primaryColor: '#C8102E',
//   secondaryColor: '#006747',
// });

// export const HALLOWEEN_THEME: ThemeOption = ThemeOption.create({
//   darkMode: true,
//   label: 'Halloween',
//   value: 'halloween-theme',
//   primaryColor: '#FF7518',
//   secondaryColor: '#31004a',
// });

// if (IS_XMAS) _themeOptions.push(XMAS_THEME);
// if (IS_HALLOWEEN) _themeOptions.push(HALLOWEEN_THEME);

// export const THEME_CONFIG = ThemeConfig.create(_themeOptions);