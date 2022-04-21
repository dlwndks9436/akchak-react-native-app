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
import {
  checkUserActive,
  checkUserLoggedIn,
  checkUserStatus,
  initializeUser,
} from '../features/user/userSlice';
import SplashScreen from '../screens/SplashScreen';
import AuthCodeScreen from '../screens/AuthCodeScreen';
import UploadPracticeScreen from '../screens/UploadPracticeScreen';
import ViewPracticeScreen from '../screens/ViewPracticeScreen';
import StartPracticeScreen from '../screens/StartPracticeScreen';
import CreateObjectiveScreen from '../screens/CreateObjectiveScreen';
import CustomAppBar from '../components/atoms/CustomAppBar';

const Stack = createStackNavigator<RootStackParamList>();

const RootStack = () => {
  const dispatch = useAppDispatch();
  const practiceLogsStatus = useAppSelector(checkPracticeLogsStatus);
  const userStatus = useAppSelector(checkUserStatus);
  const userLoggedin = useAppSelector(checkUserLoggedIn);
  const userActive = useAppSelector(checkUserActive);

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

  if (
    practiceLogsStatus === ('idle' || 'loading') ||
    userStatus === ('idle' || 'loading') ||
    userLoggedin === null
  ) {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={SplashScreen} />
      </Stack.Navigator>
    );
  }

  if (!userLoggedin) {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="AuthStack" component={AuthStack} />
      </Stack.Navigator>
    );
  }

  if (!userActive) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Validate E-mail" component={AuthCodeScreen} />
      </Stack.Navigator>
    );
  }
  return (
    <Stack.Navigator
      initialRouteName="Tab"
      screenOptions={{headerShown: false, animationTypeForReplace: 'push'}}>
      <Stack.Group>
        <Stack.Screen name="Tab" component={BottomTab} />
        <Stack.Screen name="ViewPractice" component={ViewPracticeScreen} />
        <Stack.Screen name="VideoPlay" component={VideoPlayScreen} />
        <Stack.Screen name="VideoTrim" component={VideoTrimScreen} />
        <Stack.Screen name="Upload" component={UploadPracticeScreen} />
        <Stack.Screen
          name="CameraPermission"
          component={CameraPermissionScreen}
        />
        <Stack.Screen name="Camera" component={CameraScreen} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          headerShown: true,
          header: props => <CustomAppBar {...props} />,
        }}>
        <Stack.Screen name="새 목표 설정" component={CreateObjectiveScreen} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          cardStyle: {backgroundColor: 'transparent'},
          cardOverlayEnabled: true,
          detachPreviousScreen: false,
        }}>
        <Stack.Screen name="StartPractice" component={StartPracticeScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default RootStack;
