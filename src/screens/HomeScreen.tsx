import React from 'react';
import {View, Text, StatusBar, useColorScheme, StyleSheet} from 'react-native';
import {RootStackScreenProps} from '../types/type';

export default function HomeScreen({}: RootStackScreenProps) {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.body}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text style={{marginBottom: 20}}>This is home.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
