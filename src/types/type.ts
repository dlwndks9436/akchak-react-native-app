import {StackScreenProps} from '@react-navigation/stack';

export type RootStackParamList = {
  Camera: undefined;
  Tab: undefined;
  CameraPermission: undefined;
  CameraModal: undefined;
  VideoPlay: {videoUri: string};
};

export type RootStackTabScreenProps = StackScreenProps<
  RootStackParamList,
  'Tab'
>;

export type RootStackTrimScreenProps = StackScreenProps<
  RootStackParamList,
  'VideoPlay'
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

export type PracticeLogsType = {
  datas: PracticeLogType[];
  nextID: number;
};
