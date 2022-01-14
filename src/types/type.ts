import {StackScreenProps} from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Tab: undefined;
};

export type RootStackScreenProps = StackScreenProps<RootStackParamList, 'Home'>;
