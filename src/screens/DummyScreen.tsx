import React from 'react';
import {StyleSheet, View} from 'react-native';

export default function DummyScreen() {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000000'},
});
