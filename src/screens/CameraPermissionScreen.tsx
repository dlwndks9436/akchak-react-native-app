import {useIsFocused} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {StyleSheet, View, Alert, Linking} from 'react-native';
import {Camera} from 'react-native-vision-camera';
import {RootStackScreenProps} from '../types/type';

export default function CameraPermissionScreen({
  navigation,
}: RootStackScreenProps) {
  const isFocused = useIsFocused();
  useEffect(() => {
    const navigateToCamera = async () => {
      try {
        const cameraPermission = await Camera.getCameraPermissionStatus();
        const microphonePermission =
          await Camera.getMicrophonePermissionStatus();
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
          Alert.alert('Camera and Microphone must be permitted', undefined, [
            {
              text: 'OK',
              onPress: async () => {
                await Linking.openSettings().then(() => {
                  if (
                    cameraPermission === 'authorized' &&
                    microphonePermission === 'authorized'
                  ) {
                    navigation.replace('Camera');
                  } else {
                    navigation.navigate('Tab');
                  }
                });
              },
            },
          ]);
        } else {
          const newCameraPermission = await Camera.requestCameraPermission();
          const newMicrophonePermission =
            await Camera.requestMicrophonePermission();
          if (
            newCameraPermission === 'authorized' &&
            newMicrophonePermission === 'authorized'
          ) {
            navigation.replace('Camera');
          } else {
            navigation.navigate('Tab');
          }
        }
      } catch (err) {
        Alert.alert('Info', 'Error occured during permission process');
        console.log(err);
        navigation.navigate('Tab');
      }
    };
    navigateToCamera();
  }, [navigation, isFocused]);
  return <View style={styles.body} />;
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#000000',
  },
});
