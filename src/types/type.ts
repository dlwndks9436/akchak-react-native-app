import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';

export type RootStackParamList = {
  CameraPrev: undefined;
  Camera: undefined;
  Tab: undefined;
  CameraPermission: undefined;
  VideoPlay: {videoUri: string};
  VideoTrim: {videoUri: string; duration: number; directory: string};
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

export interface PracticeLogType {
  id: number;
  filePath: string;
  fileName: string;
  duration: number | undefined;
  directory: string;
  formattedDuration: string | undefined;
  formattedDurationWithoutMillisecond: string | undefined;
  date: Date;
}

export interface PracticeLogItemType {
  id: number;
  filePath: string;
  fileName: string;
  duration: number | undefined;
  directory: string;
  formattedDuration: string | undefined;
  formattedDurationWithoutMillisecond: string | undefined;
  date: Date;
  navigation: StackNavigationProp<RootStackParamList, 'Tab'>;
}

export type PracticeLogsType = {
  datas: PracticeLogType[];
  nextID: number;
};
