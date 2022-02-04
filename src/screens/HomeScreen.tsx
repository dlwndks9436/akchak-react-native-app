import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import FocusAwareStatusBar from '../components/atoms/FocusAwareStatusBar';

export default function HomeScreen() {
  useEffect(() => {
    Orientation.unlockAllOrientations();
  }, []);
  return (
    <View style={styles.container}>
      <FocusAwareStatusBar
        translucent={true}
        barStyle={'dark-content'}
        backgroundColor={'#ffffff00'}
      />
      <Text style={{marginBottom: 20}}>This is home.</Text>
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
