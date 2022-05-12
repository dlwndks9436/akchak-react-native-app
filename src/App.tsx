import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as StoreProvider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {store} from './redux/store';
import RootStack from './navigation/RootStack';
import {PreferencesContext} from './components/PreferencesContext';
import FocusAwareStatusBar from './components/FocusAwareStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {theme} from './styles/theme';

const App = () => {
  const [isThemeDark, setIsThemeDark] = React.useState(false);
  // let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

  const toggleTheme = React.useCallback(() => {
    return setIsThemeDark(!isThemeDark);
  }, [isThemeDark]);

  const preferences = React.useMemo(
    () => ({
      toggleTheme,
      isThemeDark,
    }),
    [toggleTheme, isThemeDark],
  );

  return (
    <StoreProvider store={store}>
      <PreferencesContext.Provider value={preferences}>
        <SafeAreaProvider>
          <PaperProvider theme={theme}>
            <NavigationContainer theme={theme}>
              <FocusAwareStatusBar
                translucent={true}
                barStyle={'dark-content'}
                backgroundColor={'#ffffff00'}
              />
              <RootStack />
            </NavigationContainer>
          </PaperProvider>
        </SafeAreaProvider>
      </PreferencesContext.Provider>
    </StoreProvider>
  );
};

export default App;
