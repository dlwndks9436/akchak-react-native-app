import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './screens/Home';

import CameraView from './components/CameraView';

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
};

export type ButtonParamList = {
  CustomButton: {
    level: number;
  };
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