import React from 'react';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import LoadingScreen from '../screens/LoadingScreen';

const Tab = createMaterialBottomTabNavigator();

export default function BottomTab() {
  return (
    <Tab.Navigator initialRouteName="Home" backBehavior="initialRoute">
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Loading" component={LoadingScreen} />
    </Tab.Navigator>
  );
}
