import merge from 'deepmerge';
import {
  // DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from 'react-native-paper';
import {
  // DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
// const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

export const theme = {
  ...CombinedDefaultTheme,
  colors: {
    ...CombinedDefaultTheme.colors,
    primary: '#0b3454',
    accent: '#e0ff4f',
    notification: '#bfd7ea',
    backdrop: '#f2f2f200',
    placeholder: '#0b3454',
    error: '#ff6663',
    text: '#0b3454',
    card: 'white',
    border: 'white',
    background: 'white',
  },
};
