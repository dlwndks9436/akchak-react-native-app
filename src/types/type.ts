import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';

export type RootStackParamList = {
  Camera: undefined;
  Tab: undefined;
  CameraPermission: undefined;
  CameraModal: undefined;
  VideoPlay: {videoUri: string};
  VideoTrim: {videoUri: string; duration: number};
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

export type RootStackModalScreenProps = StackScreenProps<
  RootStackParamList,
  'CameraModal'
>;

export interface PracticeLogType {
  id: number;
  filePath: string;
  fileName: string;
  duration: number | undefined;
  date: Date;
}

export interface PracticeLogItemType {
  id: number;
  filePath: string;
  fileName: string;
  duration: number | undefined;
  date: Date;
  navigation: StackNavigationProp<RootStackParamList, 'Tab'>;
}

export type PracticeLogsType = {
  datas: PracticeLogType[];
  nextID: number;
};
