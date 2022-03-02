import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '../types/type';
import BottomTab from './BottomTab';
import VideoPlayScreen from '../screens/VideoPlayScreen';
import VideoTrimScreen from '../screens/VideoTrimScreen';
import CameraPermissionScreen from '../screens/CameraPermissionScreen';
import CameraScreen from '../screens/CameraScreen';
import AuthStack from './AuthStack';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {
  checkPracticeLogsStatus,
  initializePracticeLogs,
} from '../features/practiceLogs/practiceLogsSlice';
import {checkUserStatus, initializeUser} from '../features/user/userSlice';
import SplashScreen from '../screens/SplashScreen';
// import SecureStore from 'expo-secure-store';

const Stack = createStackNavigator<RootStackParamList>();

const RootStack = () => {
  const dispatch = useAppDispatch();
  const practiceLogsStatus = useAppSelector(checkPracticeLogsStatus);
  const userStatus = useAppSelector(checkUserStatus);

  useEffect(() => {
    if (practiceLogsStatus === 'idle') {
      dispatch(initializePracticeLogs());
    }
  }, [practiceLogsStatus, dispatch]);

  useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(initializeUser());
    }
  }, [userStatus, dispatch]);

  // useEffect(() => {
  //   const getToken = async()=>{
  //     const savedAccessToken = await SecureStore.getItemAsync('accessToken');
  //     const savedRefreshToken = await SecureStore.getItemAsync('refreshToken');
  //     if(savedAccessToken && savedRefreshToken) {

  //     }
  //   }
  // }, []);

  if (
    practiceLogsStatus === ('idle' || 'loading') &&
    userStatus === ('idle' || 'loading')
  ) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      initialRouteName="Tab"
      screenOptions={{headerShown: false, animationTypeForReplace: 'push'}}>
      <Stack.Group>
        <Stack.Screen name="Tab" component={BottomTab} />
        <Stack.Screen name="VideoPlay" component={VideoPlayScreen} />
        <Stack.Screen name="VideoTrim" component={VideoTrimScreen} />
        <Stack.Screen
          name="CameraPermission"
          component={CameraPermissionScreen}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{presentation: 'modal'}}>
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="AuthStack" component={AuthStack} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default RootStack;
