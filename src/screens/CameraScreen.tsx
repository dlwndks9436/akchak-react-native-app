import React, {useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import LoadingScreen from './LoadingScreen';
import {useIsFocused} from '@react-navigation/native';

export default function CameraScreen() {
  const devices = useCameraDevices();
  const camera = useRef<Camera>(null);
  const [recording, setRecording] = useState(false);

  const device = devices.back;
  const isFocused = useIsFocused();

  const record = () => {
    camera?.current?.startRecording({
      flash: 'on',
      onRecordingFinished: video => console.log(video),
      onRecordingError: error => console.error(error),
    });
    setRecording(true);
  };

  const stopRecord = async () => {
    console.log('hello');
    await camera?.current?.stopRecording().finally(() => {
      setRecording(false);
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
      <TouchableOpacity
        style={styles.button}
        onPress={recording ? stopRecord : record}>
        <Text style={styles.text}>{recording ? 'Stop' : 'Record'}</Text>
      </TouchableOpacity>
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
