import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import {AuthStackParamList} from '../types';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import CustomAppBar from '../components/atoms/CustomAppBar';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="로그인"
      screenOptions={{
        headerShown: true,
        header: props => <CustomAppBar {...props} />,
      }}>
      <Stack.Group>
        <Stack.Screen name="로그인" component={LoginScreen} />
        <Stack.Screen name="회원가입" component={SignupScreen} />
        <Stack.Screen name="새 비밀번호" component={ForgotPasswordScreen} />
        <Stack.Screen name="이메일 인증" component={VerifyEmailScreen} />
        <Stack.Screen name="비밀번호 변경" component={ChangePasswordScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default AuthStack;
