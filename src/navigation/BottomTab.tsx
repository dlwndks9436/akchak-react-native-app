/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen';
import DummyScreen from '../screens/DummyScreen';
import PracticeLogListScreen from '../screens/PracticeLogListScreen';
import {RootStackParamList} from '../types/type';
import {StackNavigationProp} from '@react-navigation/stack';
import {useAppSelector} from '../redux/hooks';
import {checkUserLoggedIn} from '../features/user/userSlice';
import ProfileScreen from '../screens/ProfileScreen';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {theme} from '../styles/theme';

const Tab = createMaterialBottomTabNavigator();

export default function BottomTab() {
  const userLoggedIn = useAppSelector(checkUserLoggedIn);

  const navigateToNextScreen = (
    navigation: StackNavigationProp<RootStackParamList>,
  ) => {
    if (userLoggedIn) {
      // showPermissionsPage
      //   ? navigation.navigate('CameraPermission')
      //   : navigation.navigate('Camera');
      navigation.navigate('StartPractice');
    } else {
      navigation.navigate('AuthStack');
    }
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor={theme.colors.primary}
      backBehavior="none"
      barStyle={{backgroundColor: theme.colors.background}}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcon name="home" color={color} size={26} />
          ),
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
              size={26}
            />
          ),
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
              size={26}
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
      <Tab.Screen
        name="내 정보"
        component={ProfileScreen}
        options={() => ({
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcon name="account" color={color} size={26} />
          ),
        })}
      />
    </Tab.Navigator>
  );
}
