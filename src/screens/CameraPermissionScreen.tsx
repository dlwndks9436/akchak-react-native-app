import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {StyleSheet, Text, View, Alert, Linking} from 'react-native';
import {Camera} from 'react-native-vision-camera';

export default function CameraPermissionScreen({
  navigation,
}: BottomTabScreenProps<any, 'CameraPermission'>) {
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
          navigation.navigate('Camera');
        } else if (
          cameraPermission === 'denied' ||
          microphonePermission === 'denied'
        ) {
          await Linking.openSettings().then(() => {
            if (
              cameraPermission === 'authorized' &&
              microphonePermission === 'authorized'
            ) {
              navigation.navigate('Camera');
            } else {
              Alert.alert('Info', 'Camera and Microphone must be permitted');
              navigation.navigate('Home');
            }
          });
        } else {
          const newCameraPermission = await Camera.requestCameraPermission();
          const newMicrophonePermission =
            await Camera.requestMicrophonePermission();
          if (
            newCameraPermission === 'authorized' &&
            newMicrophonePermission === 'authorized'
          ) {
            navigation.navigate('Camera');
          } else {
            Alert.alert('Info', 'Camera and Microphone must be permitted');
            navigation.navigate('Home');
          }
        }
      } catch (err) {
        Alert.alert('Info', 'Error occured during permission process');
        console.log(err);
        navigation.navigate('Home');
      }
    };
    navigateToCamera();
  }, [navigation, isFocused]);
  return (
    <View style={styles.body}>
      <Text>Camera Permission</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});
