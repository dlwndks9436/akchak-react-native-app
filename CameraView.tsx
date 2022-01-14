import React from 'react';
import {StyleSheet} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import LoadingView from './LoadingView';

export default function CameraView() {
  const devices = useCameraDevices();
  const device = devices.back;
  if (device == null) return <LoadingView />;
  return (
    <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
  );
}

// const styles = StyleSheet.create({});
