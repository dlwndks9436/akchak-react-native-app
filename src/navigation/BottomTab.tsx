/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen';
import DummyScreen from '../screens/DummyScreen';
import PracticeLogListScreen from '../screens/PracticeLogListScreen';
import {Camera, CameraPermissionStatus} from 'react-native-vision-camera';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootStackParamList} from '../types/type';
import {StackNavigationProp} from '@react-navigation/stack';
import {useAppSelector} from '../redux/hooks';
import {checkUserLoggedIn} from '../features/user/userSlice';

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionStatus>();
  const [microphonePermission, setMicrophonePermission] =
    useState<CameraPermissionStatus>();

  const userLoggedIn = useAppSelector(checkUserLoggedIn);

  useEffect(() => {
    Camera.getCameraPermissionStatus().then(setCameraPermission);
    Camera.getMicrophonePermissionStatus().then(setMicrophonePermission);
  }, []);

  const showPermissionsPage =
    cameraPermission !== 'authorized' || microphonePermission !== 'authorized';

  const navigateToNextScreen = (
    navigation: StackNavigationProp<RootStackParamList>,
  ) => {
    if (userLoggedIn) {
      showPermissionsPage
        ? navigation.navigate('CameraPermission')
        : navigation.navigate('Camera');
    } else {
      navigation.navigate('AuthStack');
    }
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      backBehavior="initialRoute"
      screenOptions={() => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIconStyle: {width: '100%', height: '100%'},
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
        name="PracticeLog"
        component={PracticeLogListScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcon
              name="filmstrip-box-multiple"
              color={color}
              size={30}
            />
          ),
          tabBarStyle: {elevation: 5},
        }}
      />
      <Tab.Screen
        name="NavigateCamera"
        component={DummyScreen}
        options={() => ({
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcon
              name="plus-circle-outline"
              color={color}
              size={40}
            />
          ),
        })}
        listeners={({navigation}) => ({
          tabPress: event => {
            event.preventDefault();
            navigateToNextScreen(navigation);
          },
        })}
      />
    </Tab.Navigator>
  );
}
