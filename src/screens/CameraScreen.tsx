import React, {useRef, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import LoadingScreen from './LoadingScreen';
import {useIsFocused} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import RecordButton from '../components/molecules/RecordButton';
import {useAndroidBackHandler} from 'react-navigation-backhandler';
import {RootStackScreenProps} from '../types/type';

export default function CameraScreen({navigation}: RootStackScreenProps) {
  const devices = useCameraDevices();
  const camera = useRef<Camera>(null);
  const [isRecording, setIsRecording] = useState(false);

  const device = devices.back;
  const isFocused = useIsFocused();

  useAndroidBackHandler(() => {
    if (isRecording) {
      checkGoBack();
    } else {
      navigation.replace('Tab');
    }
    return true;
  });

  const record = () => {
    camera?.current?.startRecording({
      flash: 'on',
      onRecordingFinished: video => {
        console.log(video);
        const fileName: string = video.path.split('/')[8].split('-')[1];
        console.log(fileName);
        const newFilePath: string = RNFS.ExternalDirectoryPath + '/' + fileName;
        RNFS.moveFile(video.path, newFilePath)
          .then(() => {
            navigation.navigate('VideoTrim');
          })
          .catch(err => {
            console.log(err);
            Alert.alert('Error', 'Issue occured while saving File');
          });
      },
      onRecordingError: error => {
        console.error(error);
      },
    });
    setIsRecording(true);
  };

  const stopRecord = async () => {
    await camera?.current?.stopRecording().then(() => {
      console.log('Stopped recording');
      setIsRecording(false);
    });
  };

  const checkRecordFinished = () => {
    Alert.alert('Did you finish your practice?', undefined, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'OK',
        onPress: () => {
          stopRecord();
        },
      },
    ]);
  };

  const checkGoBack = () => {
    Alert.alert('Would you discard this practice?', undefined, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'OK',
        onPress: () => {
          navigation.replace('Tab');
        },
      },
    ]);
  };

  if (device == null) return <LoadingScreen />;
  return (
    <View style={styles.body}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isFocused}
        video={true}
        audio={true}
        ref={camera}
      />
      <RecordButton
        onPressFunction={isRecording ? checkRecordFinished : record}
        isRecording={isRecording}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#ffffff',
    position: 'absolute',
    width: '40%',
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 20,
    borderRadius: 5,
  },
  text: {fontSize: 20, fontFamily: 'DoHyeon-Regular'},
});
