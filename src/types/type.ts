import {StackScreenProps} from '@react-navigation/stack';

export type RootStackParamList = {
  Camera: undefined;
  Tab: undefined;
  CameraPermission: undefined;
  CameraModal: undefined;
  VideoTrim: undefined;
};

export type RootStackScreenProps = StackScreenProps<RootStackParamList, 'Tab'>;
