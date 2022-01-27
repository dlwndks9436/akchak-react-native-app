import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useEffect} from 'react';
import {RootStackTabScreenProps} from '../types/type';
import {useIsFocused} from '@react-navigation/native';

export default function NavigateCameraScreen({
  navigation,
}: RootStackTabScreenProps) {
  const isFocused = useIsFocused();
  useEffect(() => {
    navigation.navigate('CameraPermission');
  }, [navigation, isFocused]);
  return <View style={styles.body}></View>;
}

const styles = StyleSheet.create({
  body: {backgroundColor: '#000000'},
});
