import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from './types/type';
import BottomTab from './navigation/BottomTab';
import CameraScreen from './screens/CameraScreen';
import CameraPermissionScreen from './screens/CameraPermissionScreen';
import CameraModalScreen from './screens/CameraModalScreen';
import VideoPlayScreen from './screens/VideoPlayScreen';
import {Provider} from 'react-redux';
import {store} from './redux';
import VideoTrimScreen from './screens/VideoTrimScreen';

const RootStack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootStack.Navigator
          initialRouteName="Tab"
          screenOptions={{headerShown: false}}>
          <RootStack.Group>
            <RootStack.Screen name="Camera" component={CameraScreen} />
            <RootStack.Screen name="Tab" component={BottomTab} />
            <RootStack.Screen name="VideoPlay" component={VideoPlayScreen} />
            <RootStack.Screen name="VideoTrim" component={VideoTrimScreen} />
            <RootStack.Screen
              name="CameraPermission"
              component={CameraPermissionScreen}
            />
          </RootStack.Group>
          <RootStack.Group screenOptions={{presentation: 'transparentModal'}}>
            <RootStack.Screen
              name="CameraModal"
              component={CameraModalScreen}
            />
          </RootStack.Group>
        </RootStack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
