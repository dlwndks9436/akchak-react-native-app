import merge from 'deepmerge';
import {
  configureFonts,
  // DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from 'react-native-paper';
import {
  // DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';

const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
// const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

const customColors = {
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
};

type FontWeight =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | undefined;

const fontConfig = {
  web: {
    regular: {
      fontFamily: 'Orbitron-SemiBold',
      fontWeight: 'normal' as FontWeight,
    },
    medium: {
      fontFamily: 'Orbitron-Bold',
      fontWeight: 'normal' as FontWeight,
    },
    light: {
      fontFamily: 'Orbitron-Medium',
      fontWeight: 'normal' as FontWeight,
    },
    thin: {
      fontFamily: 'Orbitron-Regular',
      fontWeight: 'normal' as FontWeight,
    },
  },
  ios: {
    regular: {
      fontFamily: 'Orbitron-SemiBold',
      fontWeight: 'normal' as FontWeight,
    },
    medium: {
      fontFamily: 'Orbitron-Bold',
      fontWeight: 'normal' as FontWeight,
    },
    light: {
      fontFamily: 'Orbitron-Medium',
      fontWeight: 'normal' as FontWeight,
    },
    thin: {
      fontFamily: 'Orbitron-Regular',
      fontWeight: 'normal' as FontWeight,
    },
  },
  android: {
    regular: {
      fontFamily: 'Orbitron-SemiBold',
      fontWeight: 'normal' as FontWeight,
    },
    medium: {
      fontFamily: 'Orbitron-Bold',
      fontWeight: 'normal' as FontWeight,
    },
    light: {
      fontFamily: 'Orbitron-Medium',
      fontWeight: 'normal' as FontWeight,
    },
    thin: {
      fontFamily: 'Orbitron-Regular',
      fontWeight: 'normal' as FontWeight,
    },
  },
};

export const theme = {
  ...CombinedDefaultTheme,
  colors: customColors,
  fonts: configureFonts(fontConfig),
};
