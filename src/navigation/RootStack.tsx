import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {RootStackParamList} from '../types';
import BottomTab from './BottomTab';
import VideoPlayScreen from '../screens/VideoPlayScreen';
import VideoTrimScreen from '../screens/VideoTrimScreen';
import CameraPermissionScreen from '../screens/CameraPermissionScreen';
import CameraScreen from '../screens/CameraScreen';
import AuthStack from './AuthStack';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {
  checkUserIsAuthorized,
  checkUserLoggedIn,
  checkUserStatus,
  initializeUser,
} from '../features/user/userSlice';
import SplashScreen from '../screens/SplashScreen';
import UploadPracticeScreen from '../screens/UploadPracticeScreen';
import ViewPracticeScreen from '../screens/ViewPracticeScreen';
import StartPracticeScreen from '../screens/StartPracticeScreen';
import CreateObjectiveScreen from '../screens/CreateObjectiveScreen';
import CustomAppBar from '../components/CustomAppBar';
import SelectBookScreen from '../screens/SelectBookScreen';
import SelectMusicScreen from '../screens/SelectMusicScreen';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import AddBookScreen from '../screens/AddBookScreen';
import SelectPhraseScreen from '../screens/SelectPhraseScreen';
import AddPhraseScreen from '../screens/AddPhraseScreen';
import AddMusicScreen from '../screens/AddMusicScreen';
import SelectGoalScreen from '../screens/SelectGoalScreen';
import CreateThumbnailScreen from '../screens/CreateThumbnailScreen';
import CheckThumbnailScreen from '../screens/CheckThumbnailScreen';
import SearchPracticeScreen from '../screens/SearchPracticeScreen';
import SearchResultScreen from '../screens/SearchResultScreen';
import PersonalDataScreen from '../screens/PersonalDataScreen';

const Stack = createStackNavigator<RootStackParamList>();

const RootStack = () => {
  const dispatch = useAppDispatch();
  const userStatus = useAppSelector(checkUserStatus);
  const userLoggedin = useAppSelector(checkUserLoggedIn);
  const userIsAuthorized = useAppSelector(checkUserIsAuthorized);

  useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(initializeUser());
    }
  }, [userStatus, dispatch]);

  if (userStatus === ('idle' || 'loading') || userLoggedin === null) {
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

  if (!userIsAuthorized) {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          header: props => <CustomAppBar {...props} />,
        }}>
        <Stack.Screen name="????????? ??????" component={VerifyEmailScreen} />
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
        <Stack.Screen name="???????????? ??????" component={SearchPracticeScreen} />
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
        <Stack.Screen name="??? ?????? ??????" component={CreateObjectiveScreen} />
        <Stack.Screen name="?????? ??????" component={SelectGoalScreen} />
        <Stack.Screen name="?????? ??????" component={SelectBookScreen} />
        <Stack.Screen name="???????????? ??????" component={SelectPhraseScreen} />
        <Stack.Screen name="???????????? ??????" component={AddPhraseScreen} />
        <Stack.Screen name="?????? ??????" component={AddBookScreen} />
        <Stack.Screen name="?????? ??????" component={SelectMusicScreen} />
        <Stack.Screen name="?????? ??????" component={AddMusicScreen} />
        <Stack.Screen name="?????? ?????????" component={VideoTrimScreen} />
        <Stack.Screen name="????????? ??????" component={CreateThumbnailScreen} />
        <Stack.Screen name="????????? ??????" component={CheckThumbnailScreen} />
        <Stack.Screen name="?????? ??????" component={PersonalDataScreen} />
        <Stack.Screen name="?????? ??????" component={SearchResultScreen} />
        <Stack.Screen name="?????????" component={UploadPracticeScreen} />
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
