import {
  StackHeaderProps,
  StackNavigationProp,
  StackScreenProps,
} from '@react-navigation/stack';

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
  StartPractice: undefined;
  '새 목표 설정': undefined;
  '음악 선택': undefined;
  '교본 선택': undefined;
  '나만의 목표 설정': undefined;
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
  '이메일 인증': undefined;
};

export type AuthStackParamList = {
  로그인: undefined;
  회원가입: undefined;
  '새 비밀번호': undefined;
  '비밀번호 변경': {email: string; code: string};
  '이메일 인증': {email: string};
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

export type RootStackStartPracticeScreenProps = StackScreenProps<
  RootStackParamList,
  'StartPractice'
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
  '로그인'
>;

export type AuthStackRegisterScreenProps = StackScreenProps<
  AuthStackParamList,
  '회원가입'
>;

export type AuthStackChangePasswordScreenProps = StackScreenProps<
  AuthStackParamList,
  '비밀번호 변경'
>;

export type AuthStackForgotPasswordScreenProps = StackScreenProps<
  AuthStackParamList,
  '새 비밀번호'
>;

export type AuthStackVerifyEmailScreenProps = StackScreenProps<
  AuthStackParamList,
  '이메일 인증'
>;

export type RootStackCreateObjectiveScreenProps = StackScreenProps<
  RootStackParamList,
  '새 목표 설정'
>;

export type RootStackSelectBookScreenProps = StackScreenProps<
  RootStackParamList,
  '교본 선택'
>;

export type RootStackSelectMusicScreenProps = StackScreenProps<
  RootStackParamList,
  '음악 선택'
>;

export type RootStackStartOwnObjectiveScreenProps = StackScreenProps<
  RootStackParamList,
  '나만의 목표 설정'
>;

export type CustomAppBarProps = StackHeaderProps;

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
