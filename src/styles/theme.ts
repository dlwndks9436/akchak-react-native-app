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
  primary: '#64e9ee',
  accent: '#e66e22',
  notification: '#e66e22',
  backdrop: '#f2f2f200',
  placeholder: '#64e9ee',
  error: '#eb4d43',
  text: '#333333',
  card: '#f3f3f3',
  border: '#eoeoeo',
  background: '#f3f3f3',
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
      fontFamily: 'NotoSansKR-Regular',
      fontWeight: 'normal' as FontWeight,
    },
    medium: {
      fontFamily: 'NotoSansKR-Medium',
      fontWeight: 'normal' as FontWeight,
    },
    light: {
      fontFamily: 'NotoSansKR-Light',
      fontWeight: 'normal' as FontWeight,
    },
    thin: {
      fontFamily: 'NotoSansKR-Thin',
      fontWeight: 'normal' as FontWeight,
    },
  },
  ios: {
    regular: {
      fontFamily: 'NotoSansKR-Regular',
      fontWeight: 'normal' as FontWeight,
    },
    medium: {
      fontFamily: 'NotoSansKR-Medium',
      fontWeight: 'normal' as FontWeight,
    },
    light: {
      fontFamily: 'NotoSansKR-Light',
      fontWeight: 'normal' as FontWeight,
    },
    thin: {
      fontFamily: 'NotoSansKR-Thin',
      fontWeight: 'normal' as FontWeight,
    },
  },
  android: {
    regular: {
      fontFamily: 'NotoSansKR-Regular',
      fontWeight: 'normal' as FontWeight,
    },
    medium: {
      fontFamily: 'NotoSansKR-Medium',
      fontWeight: 'normal' as FontWeight,
    },
    light: {
      fontFamily: 'NotoSansKR-Light',
      fontWeight: 'normal' as FontWeight,
    },
    thin: {
      fontFamily: 'NotoSansKR-Thin',
      fontWeight: 'normal' as FontWeight,
    },
  },
};

export const theme = {
  ...CombinedDefaultTheme,
  colors: customColors,
  fonts: configureFonts(fontConfig),
};
