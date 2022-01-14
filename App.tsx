import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './Home';

import CameraView from './CameraView';

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Home">
        <RootStack.Screen name="Home" component={Home} />
        <RootStack.Screen name="Camera" component={CameraView} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
