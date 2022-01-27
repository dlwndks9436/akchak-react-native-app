import React, {useRef, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import LoadingScreen from './LoadingScreen';
import {useIsFocused} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import RecordButton from '../components/molecules/RecordButton';
import {useAndroidBackHandler} from 'react-navigation-backhandler';
import {
  RootStackTabScreenProps,
  PracticeLogType,
  PracticeLogsType,
} from '../types/type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';

export default function CameraScreen({navigation}: RootStackTabScreenProps) {
  const devices = useCameraDevices();
  const camera = useRef<Camera>(null);
  const [isRecording, setIsRecording] = useState(false);

  const device = devices.back;
  const isFocused = useIsFocused();

  useAndroidBackHandler(() => {
    if (isRecording) {
      checkGoBack();
    } else {
      navigation.reset({index: 0, routes: [{name: 'Tab'}]});
    }
    return true;
  });

  const record = () => {
    camera?.current?.startRecording({
      fileType: 'mp4',
      onRecordingFinished: video => {
        console.log(video);
        const fileName: string = video.path.split('/')[8].split('-')[1];
        console.log(fileName);
        const newFilePath: string = RNFS.ExternalDirectoryPath + '/' + fileName;
        FFmpegKit.execute(
          '-i ' +
            video.path +
            ' -force_key_frames "expr:gte(t,n_forced*1)"  ' +
            newFilePath,
        )
          .then(async session => {
            const returnCode = await session.getReturnCode();
            const dateOfPractice: Date = session.getCreateTime();
            if (ReturnCode.isSuccess(returnCode)) {
              // SUCCESS
              try {
                let practiceLogs: PracticeLogsType;
                const savedPracticeLogs: string | null =
                  await AsyncStorage.getItem('practice_logs');

                if (savedPracticeLogs !== null) {
                  practiceLogs = JSON.parse(savedPracticeLogs);

                  const newLogData: PracticeLogType = {
                    id: practiceLogs.nextID,
                    filePath: newFilePath,
                    fileName: 'Practice log ' + practiceLogs.nextID,
                    duration: video.duration,
                    date: dateOfPractice,
                  };
                  console.log('newLogData', newLogData);
                  const newPracticeLogs: PracticeLogsType = {
                    datas: [...practiceLogs.datas, newLogData],
                    nextID: practiceLogs.nextID + 1,
                  };
                  console.log('newPracticeLogs', newPracticeLogs);
                  await AsyncStorage.setItem(
                    'practice_logs',
                    JSON.stringify(newPracticeLogs),
                  );
                } else {
                  const newLogData: PracticeLogType = {
                    id: 1,
                    filePath: newFilePath,
                    fileName: 'Practice log 1',
                    duration: video.duration,
                    date: dateOfPractice,
                  };
                  await AsyncStorage.setItem(
                    'practice_logs',
                    JSON.stringify({datas: [newLogData], nextID: 2}),
                  );
                }
              } catch (err) {
                console.log(err);
              }

              console.log('success');
            } else if (ReturnCode.isCancel(returnCode)) {
              // CANCEL
              console.log('cancel');
            } else {
              // ERROR
              console.log('error');
            }
            // });
            navigation.navigate('VideoPlay', {videoUri: newFilePath});
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
          navigation.reset({index: 0, routes: [{name: 'Tab'}]});
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
