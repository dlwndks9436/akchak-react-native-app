import React from 'react';
import {
  View,
  Text,
  StatusBar,
  useColorScheme,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import {RootStackParamList} from './App';
import {StackScreenProps} from '@react-navigation/stack';
import TextButton from './TextButton';
import {Camera} from 'react-native-vision-camera';

type Props = StackScreenProps<RootStackParamList, 'Home'>;

export default function Home({navigation}: Props) {
  const navigateToCamera = async () => {
    try {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      const microphonePermission = await Camera.getMicrophonePermissionStatus();
      console.log(cameraPermission, microphonePermission);
      if (
        cameraPermission === 'authorized' &&
        microphonePermission === 'authorized'
      ) {
        navigation.navigate('Camera');
      } else if (
        cameraPermission === 'denied' ||
        microphonePermission === 'denied'
      ) {
        await Linking.openSettings();
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
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.body}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text style={{marginBottom: 20}}>This is home.</Text>
      <TextButton
        colorDepth={2}
        text="Camera"
        onPressFunc={() => {
          navigateToCamera();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
