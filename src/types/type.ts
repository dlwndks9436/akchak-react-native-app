import {StackScreenProps} from '@react-navigation/stack';

export type RootStackParamList = {
  Camera: undefined;
  Tab: undefined;
  CameraPermission: undefined;
};

export type RootStackScreenProps = StackScreenProps<RootStackParamList, 'Tab'>;
