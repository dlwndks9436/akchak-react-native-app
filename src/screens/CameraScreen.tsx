import React, {useState, useEffect} from 'react';
import {Dimensions, Platform, StatusBar, StyleSheet, View} from 'react-native';
import {Camera} from 'expo-camera';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, IconButton, Text} from 'react-native-paper';
import {RootStackCameraScreenProps} from '../types/type';

export default function CameraScreen({
  navigation,
}: RootStackCameraScreenProps): React.ReactElement {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>();
  const [hasMicrophonePermission, setHasMicrophonePermission] =
    useState<boolean>();

  const [camera, setCamera] = useState<Camera | null>(null);

  // Screen Ratio and image padding
  const [imagePadding, setImagePadding] = useState(0);
  const [ratio, setRatio] = useState('4:3'); // default is 4:3
  const {height, width} = Dimensions.get('window');
  const screenRatio = height / width;
  const [isRatioSet, setIsRatioSet] = useState(false);
  const [videoUri, setVideoUri] = useState<string>();
  const [finishedPractice, setFinishedPractice] = useState<boolean>(false);

  const getPermission = async () => {
    await setTimeout(async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const microphonePermission =
        await Camera.requestMicrophonePermissionsAsync();
      console.log('camera permission: ', cameraPermission);
      console.log('microphone permission: ', microphonePermission);
      setHasCameraPermission(cameraPermission.status === 'granted');
      setHasMicrophonePermission(microphonePermission.status === 'granted');
    }, 200);
  };

  const prepareRatio = async () => {
    let desiredRatio = '4:3'; // Start with the system default
    // This issue only affects Android
    if (Platform.OS === 'android' && camera) {
      const supportedRatios = await camera.getSupportedRatiosAsync();
      console.log('supported Ratios: ', supportedRatios);

      // Calculate the width/height of each of the supported camera ratios
      // These width/height are measured in landscape mode
      // find the ratio that is closest to the screen ratio without going over
      let distances: {[key: string]: number} = {};
      let realRatios: {[key: string]: number} = {};
      let minDistance = null;
      for (const supportedRatio of supportedRatios) {
        const parts = supportedRatio.split(':');
        const realRatio = parseInt(parts[0], 10) / parseInt(parts[1], 10);
        realRatios[supportedRatio] = realRatio;
        // ratio can't be taller than screen, so we don't want an abs()
        const distance = screenRatio - realRatio;
        distances[supportedRatio] = distance;
        if (minDistance == null) {
          minDistance = supportedRatio;
        } else {
          if (distance >= 0 && distance < distances[minDistance]) {
            minDistance = supportedRatio;
          }
        }
      }
      // set the best match
      desiredRatio = minDistance as string;
      console.log('desired ratio : ', desiredRatio);

      //  calculate the difference between the camera width and the screen height
      const remainder = Math.floor(
        (height - realRatios[desiredRatio] * width) / 2,
      );
      // set the preview padding and preview ratio
      setImagePadding(remainder);
      setRatio(desiredRatio);
      // Set a flag so we don't do this
      // calculation each time the screen refreshes
      setIsRatioSet(true);
    }
  };

  // the camera must be loaded in order to access the supported ratios
  const setCameraReady = async () => {
    if (!isRatioSet) {
      await prepareRatio();
    }
    await startRecording();
  };

  const startRecording = async () => {
    const {uri} = await camera!.recordAsync();
    setVideoUri(uri);
  };

  useEffect(() => {
    getPermission();
  }, []);

  useEffect(() => {
    if (finishedPractice && videoUri) {
      console.log('URI of video is :', videoUri);
    }
  }, [finishedPractice, videoUri]);

  if (
    hasCameraPermission === undefined ||
    hasMicrophonePermission === undefined
  ) {
    return <View style={styles.container} />;
  }
  if (hasCameraPermission === false || hasMicrophonePermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'black'} barStyle={'light-content'} />
      <Camera
        style={[
          styles.camera,
          {marginTop: imagePadding, marginBottom: imagePadding},
        ]}
        type={Camera.Constants.Type.front}
        ref={ref => {
          setCamera(ref);
        }}
        onCameraReady={setCameraReady}
        ratio={ratio}
      />
      <IconButton
        icon="close"
        color={'white'}
        size={30}
        style={{position: 'absolute', top: 30, alignSelf: 'flex-end'}}
        onPress={() => {
          camera!.stopRecording();
          navigation.goBack();
        }}
      />
      <Button
        labelStyle={styles.text}
        mode={'outlined'}
        style={{position: 'absolute', bottom: 0, alignSelf: 'center'}}
        onPress={() => {
          camera!.stopRecording();
          setFinishedPractice(true);
        }}>
        연습 끝내기
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'black'},
  camera: {flex: 1},
  buttonContainer: {},
  button: {
    width: Dimensions.get('window').width / 2,
    height: 50,
  },
  exitButton: {},
  text: {fontSize: 30},
});
