import {StackScreenProps} from '@react-navigation/stack';

export type RootStackParamList = {
  Camera: undefined;
  Tab: undefined;
  CameraPermission: undefined;
  CameraModal: undefined;
  VideoTrim: {videoUri: string};
};

export type RootStackTabScreenProps = StackScreenProps<
  RootStackParamList,
  'Tab'
>;

export type RootStackTrimScreenProps = StackScreenProps<
  RootStackParamList,
  'VideoTrim'
>;
