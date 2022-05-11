import {
  StackHeaderProps,
  StackNavigationProp,
  StackScreenProps,
} from '@react-navigation/stack';
import {VideoFile} from 'react-native-vision-camera';

export type RootStackParamList = {
  Camera: {
    goal: Goal;
  };
  Tab: undefined;
  CameraPermission: {
    goal: Goal;
  };
  VideoPlay: {
    goal: Goal;
    video: Video;
    creationTime: string;
    practiceTime: number;
  };
  '영상 편집': {
    goal: Goal;
    media: VideoFile;
    creationTime: string;
    practiceTime: number;
  };
  StartPractice: undefined;
  '새 목표 설정': undefined;
  '목표 선택': undefined;
  '음악 선택': undefined;
  '음악 추가': undefined;
  '교본 선택': undefined;
  '섬네일 추가': {
    goal: Goal;
    video: Video;
    creationTime: string;
    practiceTime: number;
  };
  '섬네일 확인': {
    goal: Goal;
    video: Video;
    creationTime: string;
    practiceTime: number;
    thumbnailPath: string;
  };
  '프레이즈 선택': {
    book: Book;
  };
  '프레이즈 추가': {
    book: Book;
  };
  '교본 추가': undefined;
  업로드: {
    goal: Goal;
    video: Video;
    creationTime: string;
    practiceTime: number;
    thumbnailPath: string;
  };
  AuthStack: undefined;
  'Validate E-mail': undefined;
  Splash: undefined;
  ViewPractice: {
    practiceLogId: number;
  };
  '이메일 인증': undefined;
  '연습기록 검색': undefined;
  '검색 결과': {
    type: QueryType;
    query: string;
  };
  '개인 정보': undefined;
};

export type AuthStackParamList = {
  로그인: undefined;
  회원가입: undefined;
  '새 비밀번호': undefined;
  '비밀번호 변경': {email: string; code: string};
  '이메일 인증': {email: string};
};

export type BottomTabParamList = {
  홈: undefined;
  PracticeLog: undefined;
  NavigateCamera: undefined;
  '내 정보': undefined;
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
  '영상 편집'
>;

export type RootStackCreateThumbnailScreenProps = StackScreenProps<
  RootStackParamList,
  '섬네일 추가'
>;

export type RootStackCheckThumbnailScreenProps = StackScreenProps<
  RootStackParamList,
  '섬네일 확인'
>;

export type RootStackUploadScreenProps = StackScreenProps<
  RootStackParamList,
  '업로드'
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

export type RootStackSelectGoalScreenProps = StackScreenProps<
  RootStackParamList,
  '목표 선택'
>;

export type RootStackSelectBookScreenProps = StackScreenProps<
  RootStackParamList,
  '교본 선택'
>;

export type RootStackSelectPhraseScreenProps = StackScreenProps<
  RootStackParamList,
  '프레이즈 선택'
>;

export type RootStackAddPhraseScreenProps = StackScreenProps<
  RootStackParamList,
  '프레이즈 추가'
>;

export type RootStackAddBookScreenProps = StackScreenProps<
  RootStackParamList,
  '교본 추가'
>;

export type RootStackSelectMusicScreenProps = StackScreenProps<
  RootStackParamList,
  '음악 선택'
>;

export type RootStackAddMusicScreenProps = StackScreenProps<
  RootStackParamList,
  '음악 추가'
>;

export type RootStackSearchPracticeScreenProps = StackScreenProps<
  RootStackParamList,
  '연습기록 검색'
>;

export type RootStackSearchResultScreenProps = StackScreenProps<
  RootStackParamList,
  '검색 결과'
>;

export type RootStackPersonalDataScreenProps = StackScreenProps<
  RootStackParamList,
  '개인 정보'
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

export interface Book {
  id: number;
  title: string;
  author: string;
}

export interface Phrase {
  id: number;
  title: string;
  subheading: string;
  page: number;
}

export interface Music {
  id: number;
  title: string;
  artist: string;
}

export interface Goal {
  id: number;
  player_id: number;
  phrase_id?: number;
  music_id?: number;
  music?: Music;
  phrase?: Phrase;
}

interface Video {
  duration: number;
  path: string;
  fileName: string;
  fileNameWithExt: string;
  fileSize: number;
}

export type QueryType = '책 제목' | '제목' | '닉네임' | '아티스트';
