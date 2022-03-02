import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Orientation from 'react-native-orientation-locker';

export default function SplashScreen() {
  useEffect(() => {
    Orientation.unlockAllOrientations();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={{marginBottom: 20}}>This is Splash screen.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
