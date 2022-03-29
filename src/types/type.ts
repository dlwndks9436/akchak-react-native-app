import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';

export type RootStackParamList = {
  Camera: undefined;
  Tab: undefined;
  CameraPermission: undefined;
  VideoPlay: {videoUri: string};
  VideoTrim: {
    videoUri: string;
    duration: number;
    directory: string;
    id: string;
    fileName: string;
  };
  Upload: {
    trimmedVideoUri?: string;
    thumbnailUri?: string;
    duration?: number;
    id: string;
    practiceTime?: number;
    fileName?: string;
    thumbnailName?: string;
    directory?: string;
    title?: string;
    description?: string;
  };
  AuthStack: undefined;
  'Validate E-mail': undefined;
  Splash: undefined;
  ViewPractice: {
    practiceId: number;
  };
};

export type AuthStackParamList = {
  Login: undefined;
  'Sign up': undefined;
  'New password': undefined;
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

export type RootStackViewPracticeScreenProps = StackScreenProps<
  RootStackParamList,
  'ViewPractice'
>;

export type RootStackPlayScreenProps = StackScreenProps<
  RootStackParamList,
  'VideoPlay'
>;

export type RootStackTrimScreenProps = StackScreenProps<
  RootStackParamList,
  'VideoTrim'
>;

export type RootStackUploadScreenProps = StackScreenProps<
  RootStackParamList,
  'Upload'
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
  'Sign up'
>;

export type AuthStackForgotPasswordScreenProps = StackScreenProps<
  AuthStackParamList,
  'New password'
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
