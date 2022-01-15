import React, {useRef, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import LoadingScreen from './LoadingScreen';
import {useIsFocused} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import RecordButton from '../components/molecules/RecordButton';

export default function CameraScreen() {
  const devices = useCameraDevices();
  const camera = useRef<Camera>(null);
  const [isRecording, setIsRecording] = useState(false);

  const device = devices.back;
  const isFocused = useIsFocused();

  const record = () => {
    camera?.current?.startRecording({
      flash: 'on',
      onRecordingFinished: video => {
        console.log(video);
        const fileName: string = video.path.split('/')[8].split('-')[1];
        console.log(fileName);
        const newFilePath: string = RNFS.ExternalDirectoryPath + '/' + fileName;
        RNFS.moveFile(video.path, newFilePath).catch(err => {
          console.log(err);
          Alert.alert('Error', 'Issue occured while saving File');
        });
      },
      onRecordingError: error => {
        console.error(error);
        Alert.alert('Error', 'Issue occured regarding to recording');
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
        onPressFunction={isRecording ? stopRecord : record}
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
