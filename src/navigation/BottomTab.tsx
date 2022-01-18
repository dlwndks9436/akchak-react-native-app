/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen';
import {gray} from '../styles/colors';
import NavigateCameraScreen from '../screens/NavigateCameraScreen';

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="initialRoute"
      screenOptions={() => ({
        tabBarActiveTintColor: gray[8],
        tabBarInactiveTintColor: gray[6],
        headerShown: false,
        tabBarShowLabel: false,
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcon name="home" color={color} size={30} />
          ),
          tabBarStyle: {elevation: 5},
        }}
      />
      <Tab.Screen
        name="NavigateCamera"
        component={NavigateCameraScreen}
        options={() => ({
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcon
              name="plus-circle-outline"
              color={color}
              size={40}
            />
          ),
          // tabBarStyle: {height: 0, backgroundColor: '#000000'},
          tabBarStyle: {backgroundColor: '#000000'},
        })}
      />
    </Tab.Navigator>
  );
}
