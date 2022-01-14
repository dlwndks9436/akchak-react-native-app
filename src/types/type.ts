import {StackScreenProps} from '@react-navigation/stack';

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
};

export type RootStackScreenProps = StackScreenProps<RootStackParamList, 'Home'>;
