import React from 'react';
import {View, Text, Button} from 'react-native';
import {RootStackParamList} from './App';
import {StackScreenProps} from '@react-navigation/stack';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function Home({navigation}: Props) {
  return (
    <View>
      <Text>This is home.</Text>
      <Button
        title="Camera"
        onPress={() => {
          navigation.navigate('Camera');
        }}
      />
    </View>
  );
}
