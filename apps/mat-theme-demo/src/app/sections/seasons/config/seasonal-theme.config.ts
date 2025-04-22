import { ThemingConfig, ThemeOption } from "@moonlight/material/theming/config";

const today = new Date();
const thisYear = today.getFullYear();
const xmasTime = new Date(thisYear, 11, 1);
const halloweenTimeStart = new Date(thisYear, 10, 1);
const halloweenTimeEnd = new Date(thisYear, 11, 1);
export const IS_XMAS = today >= xmasTime;
export const IS_HALLOWEEN = today >= halloweenTimeStart && today < halloweenTimeEnd;





const SPRING_THEME = ThemeOption.create({
  darkMode: false,
  label: 'Spring',
  value: 'spring',
  primaryColor: '#8BC34A', // Fresh green
  secondaryColor: '#FFEB3B', // Bright yellow
  tertiaryColor: '#FF4081', // Pink blossom
})
const SUMMER_THEME = ThemeOption.create({
  darkMode: false,
  label: 'Summer',
  value: 'summer',
  primaryColor: '#03A9F4', // Sky blue
  secondaryColor: '#FF9800', // Warm orange
  tertiaryColor: '#4CAF50', // Vibrant green
})
const AUTUMN_THEME = ThemeOption.create({
  darkMode: false,
  label: 'Autumn',
  value: 'autumn',
  primaryColor: '#FF5722', // Sunset orange
  secondaryColor: '#FFC107', // Golden yellow
  tertiaryColor: '#191102', // Lime green
})
const WINTER_THEME = ThemeOption.create({
  darkMode: false,
  label: 'Winter',
  value: 'winter',
  primaryColor: '#1E88E5', // Ice blue
  secondaryColor: '#E0E0E0', // Silver/snow
  tertiaryColor: '#263238', // Dark blue-gray
})




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
  }),
  SPRING_THEME,
  SUMMER_THEME,
  AUTUMN_THEME,
  WINTER_THEME,
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

export const THEME_CONFIG = ThemingConfig.create(_themeOptions)
  .showTransitions()






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