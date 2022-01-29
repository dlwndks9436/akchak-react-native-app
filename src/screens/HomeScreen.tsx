import React, {useEffect} from 'react';
import {View, Text, StatusBar, useColorScheme, StyleSheet} from 'react-native';
import Orientation from 'react-native-orientation-locker';

export default function HomeScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  useEffect(() => {
    Orientation.unlockAllOrientations();
  }, []);
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
