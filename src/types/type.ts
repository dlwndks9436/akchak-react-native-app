import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';

export type RootStackParamList = {
  Camera: undefined;
  Tab: undefined;
  CameraPermission: undefined;
  VideoPlay: {videoUri: string};
  VideoTrim: {videoUri: string; duration: number; directory: string};
  AuthStack: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  CreateNewPassword: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  PracticeLog: undefined;
  NavigateCamera: undefined;
};

export type RootStackTabScreenProps = StackScreenProps<
  RootStackParamList,
  'Tab'
>;

export type RootStackPlayScreenProps = StackScreenProps<
  RootStackParamList,
  'VideoPlay'
>;

export type RootStackTrimScreenProps = StackScreenProps<
  RootStackParamList,
  'VideoTrim'
>;

export type RootStackPermissionScreenProps = StackScreenProps<
  RootStackParamList,
  'CameraPermission'
>;

export type RootStackCameraScreenProps = StackScreenProps<
  RootStackParamList,
  'Camera'
>;

export type AuthStackLoginScreenProps = StackScreenProps<
  AuthStackParamList,
  'Login'
>;

export type AuthStackRegisterScreenProps = StackScreenProps<
  AuthStackParamList,
  'Register'
>;

export type AuthStackForgotPasswordScreenProps = StackScreenProps<
  AuthStackParamList,
  'ForgotPassword'
>;

export type AuthStackCreateNewPasswordScreenProps = StackScreenProps<
  AuthStackParamList,
  'CreateNewPassword'
>;

export interface PracticeLogType {
  id: string;
  filePath: string;
  fileName: string;
  duration: number | undefined;
  directory: string;
  formattedDuration: string | undefined;
  formattedDurationWithoutMillisecond: string | undefined;
  date: string;
}

export interface PracticeLogItemType {
  id: string;
  filePath: string;
  fileName: string;
  duration: number | undefined;
  directory: string;
  formattedDuration: string | undefined;
  formattedDurationWithoutMillisecond: string | undefined;
  date: string;
  navigation: StackNavigationProp<RootStackParamList, 'Tab'>;
}
