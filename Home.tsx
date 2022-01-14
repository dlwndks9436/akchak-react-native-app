import React from 'react';
import {View, Text, Button, StatusBar, useColorScheme} from 'react-native';
import {RootStackParamList} from './App';
import {StackScreenProps} from '@react-navigation/stack';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function Home({navigation}: Props) {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
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
