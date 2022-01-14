import React from 'react';
import {StyleSheet} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import LoadingScreen from '../screens/LoadingScreen';
import {useIsFocused} from '@react-navigation/native';

export default function CameraView() {
  const devices = useCameraDevices();
  console.log(devices);

  const device = devices.back;
  const isFocused = useIsFocused();
  if (device == null) return <LoadingScreen />;
  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={isFocused}
      video={true}
      audio={true}
    />
  );
}

// const styles = StyleSheet.create({});
