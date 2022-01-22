import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Alert, Linking} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import {RootStackPermissionScreenProps} from '../types/type';
import {CameraPermissionStatus} from 'react-native-vision-camera';
import {useIsFocused} from '@react-navigation/native';

export default function CameraPermissionScreen({
  navigation,
}: RootStackPermissionScreenProps) {
  const [permissions, setPermissions] = useState<
    (CameraPermissionStatus | null)[]
  >([null, null]);

  const isFocused = useIsFocused();

  useEffect(() => {
    const navigateToCamera = async () => {
      try {
        let cameraPermission = await Camera.getCameraPermissionStatus();
        let microphonePermission = await Camera.getMicrophonePermissionStatus();

        console.log('cameraPermission : ', cameraPermission);
        console.log('microphonePermission : ', microphonePermission);

        if (
          cameraPermission === 'authorized' &&
          microphonePermission === 'authorized'
        ) {
          navigation.replace('Camera');
        } else if (
          cameraPermission === 'denied' ||
          microphonePermission === 'denied'
        ) {
          await Alert.alert(
            'Camera and Microphone must be permitted',
            undefined,
            [
              {
                text: 'OK',
                onPress: async () => {
                  await Linking.openSettings().then(async () => {
                    navigation.replace('Tab');
                  });
                },
              },
            ],
          );
        } else {
          cameraPermission = await Camera.requestCameraPermission();
          microphonePermission = await Camera.requestMicrophonePermission();
          setPermissions([cameraPermission, microphonePermission]);
        }
      } catch (err) {
        await Alert.alert('Info', 'Error occured during permission process');
        console.log(err);
        navigation.replace('Tab');
      }
    };
    navigateToCamera();
  }, [navigation, permissions, isFocused]);
  return <View style={styles.body} />;
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#000000',
  },
});
