import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './Home';
import {
  StatusBar,
  // StyleSheet,
  useColorScheme,
} from 'react-native';
import CameraView from './CameraView';

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Home">
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <RootStack.Screen name="Home" component={Home} />
        <RootStack.Screen name="Camera" component={CameraView} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

// const styles = StyleSheet.create({});

export default App;
