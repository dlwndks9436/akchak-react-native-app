import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, Linking, Text, TouchableOpacity} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import {RootStackPermissionScreenProps} from '../types';
import {CameraPermissionStatus} from 'react-native-vision-camera';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CameraPermissionScreen({
  navigation,
  route,
}: RootStackPermissionScreenProps) {
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>('not-determined');
  const [microphonePermissionStatus, setMicrophonePermissionStatus] =
    useState<CameraPermissionStatus>('not-determined');

  const requestMicrophonePermission = useCallback(async () => {
    console.log('Requesting microphone permission...');
    const permission = await Camera.requestMicrophonePermission();
    console.log(`Microphone permission status: ${permission}`);

    if (permission === 'denied') await Linking.openSettings();
    setMicrophonePermissionStatus(permission);
  }, []);

  const requestCameraPermission = useCallback(async () => {
    console.log('Requesting camera permission...');
    const permission = await Camera.requestCameraPermission();
    console.log(`Camera permission status: ${permission}`);

    if (permission === 'denied') await Linking.openSettings();
    setCameraPermissionStatus(permission);
  }, []);

  useEffect(() => {
    Camera.getCameraPermissionStatus().then(setCameraPermissionStatus);
    Camera.getMicrophonePermissionStatus().then(setMicrophonePermissionStatus);

    if (
      cameraPermissionStatus === 'authorized' &&
      microphonePermissionStatus === 'authorized'
    ) {
      navigation.replace('Camera', {goal: route.params.goal});
    }
    if (
      cameraPermissionStatus === 'not-determined' &&
      microphonePermissionStatus === 'not-determined'
    ) {
      const checkCameraPermission = async () => {
        const result = await Camera.requestCameraPermission();
        return result;
      };
      const checkMicrophonePermission = async () => {
        const result = await Camera.requestMicrophonePermission();
        return result;
      };
      checkCameraPermission().then(cameraPermission => {
        checkMicrophonePermission().then(microphonePermission => {
          setMicrophonePermissionStatus(microphonePermission);
          setCameraPermissionStatus(cameraPermission);
        });
      });
    }
  }, [cameraPermissionStatus, microphonePermissionStatus, navigation, route]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Permissions of following must be granted to use video recording.
      </Text>
      {cameraPermissionStatus !== 'authorized' && (
        <View style={styles.permissionContainer}>
          <Text style={styles.boldText}>Camera function</Text>
          <TouchableOpacity
            onPress={requestCameraPermission}
            style={styles.button}>
            <Text style={styles.normalText}>Grant permission</Text>
            <MaterialCommunityIcon
              name="chevron-right"
              size={40}
              color="white"
            />
          </TouchableOpacity>
        </View>
      )}
      {microphonePermissionStatus !== 'authorized' && (
        <View style={styles.permissionContainer}>
          <Text style={styles.boldText}>Microphone function</Text>
          <TouchableOpacity
            onPress={requestMicrophonePermission}
            style={styles.button}>
            <Text style={styles.normalText}>Grant permission</Text>
            <MaterialCommunityIcon
              name="chevron-right"
              size={40}
              color="white"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
    padding: 20,
  },
  permissionContainer: {
    marginTop: 40,
  },
  title: {
    fontFamily: 'Orbitron-VariableFont_wght',
    color: 'white',
    fontSize: 30,
  },
  boldText: {
    fontFamily: 'Orbitron-VariableFont_wght',
    color: 'white',
    fontSize: 30,
  },
  normalText: {
    fontFamily: 'Orbitron-VariableFont_wght',
    color: 'white',
    fontSize: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
});
