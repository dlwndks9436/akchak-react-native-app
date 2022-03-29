import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import {AuthStackParamList} from '../types/type';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import CreateNewPasswordScreen from '../screens/CreateNewPasswordScreen';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{headerTitleStyle: {fontSize: 30}}}>
      <Stack.Group>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Sign up" component={SignupScreen} />
        <Stack.Screen name="New password" component={ForgotPasswordScreen} />
        <Stack.Screen
          name="CreateNewPassword"
          component={CreateNewPasswordScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default AuthStack;
