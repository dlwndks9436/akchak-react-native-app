import React, {useEffect, useRef, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {
  Camera,
  CameraDevice,
  useCameraDevices,
} from 'react-native-vision-camera';
// import LoadingScreen from './LoadingScreen';
import {useIsFocused} from '@react-navigation/native';
import RNFS from 'react-native-fs';
import RecordButton from '../components/molecules/RecordButton';
import {useAndroidBackHandler} from 'react-navigation-backhandler';
import {
  RootStackTabScreenProps,
  // PracticeLogType,
  // PracticeLogsType,
} from '../types/type';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {FFprobeKit, ReturnCode} from 'ffmpeg-kit-react-native';
// import Orientation, {OrientationLocker} from 'react-native-orientation-locker';

export default function CameraScreenPrev({
  navigation,
}: RootStackTabScreenProps) {
  const devices = useCameraDevices();
  const camera = useRef<Camera>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const device = devices.back;
  const isFocused = useIsFocused();

  useAndroidBackHandler(() => {
    if (isRecording) {
      checkGoBack();
    } else {
      // Orientation.unlockAllOrientations();
      navigation.reset({index: 0, routes: [{name: 'Tab'}]});
    }
    return true;
  });

  useEffect(() => {
    setTimeout(() => {
      if (device !== null) {
        setIsLoading(false);
      }
    }, 1000);
  }, [device]);

  // const getDuration = async (filePath: string): Promise<number | undefined> => {
  //   let duration;
  //   await FFprobeKit.execute(
  //     '-v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ' +
  //       filePath,
  //   )
  //     .then(async ffprobeSession => {
  //       const ffprobeReturnCode = await ffprobeSession.getReturnCode();
  //       if (ReturnCode.isSuccess(ffprobeReturnCode)) {
  //         duration = await ffprobeSession.getOutput();
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  //   return duration;
  // };

  // const getFormattedDuration = async (
  //   filePath: string,
  // ): Promise<string | undefined> => {
  //   let duration;
  //   await FFprobeKit.execute(
  //     '-v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 -sexagesimal ' +
  //       filePath,
  //   )
  //     .then(async ffprobeSession => {
  //       const ffprobeReturnCode = await ffprobeSession.getReturnCode();
  //       if (ReturnCode.isSuccess(ffprobeReturnCode)) {
  //         duration = await ffprobeSession.getOutput();
  //       }
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });
  //   return duration;
  // };

  const record = () => {
    camera?.current?.startRecording({
      onRecordingFinished: video => {
        console.log(video.path);
        const fileName: string = video.path
          .split('/')[8]
          .split('-')[1]
          .split('.')[0];
        console.log(fileName);
        console.log('initial duration of video', video.duration);
        const directory: string =
          'file://' + RNFS.ExternalDirectoryPath + '/' + 'practice.mp4';
        RNFS.moveFile(video.path, directory);

        // Orientation.unlockAllOrientations();
        navigation.navigate('VideoPlay', {videoUri: video.path});

        // const directory: string =
        //   'file://' + RNFS.ExternalDirectoryPath + '/' + fileName;
        // const newFilePath: string = directory + '/practice.mp4';

        // console.log(newFilePath);

        // RNFS.mkdir(RNFS.ExternalDirectoryPath + '/' + fileName);

        // FFmpegKit.execute(
        //   // '-i ' +
        //   //   video.path +
        //   //   '  -force_key_frames "expr:gte(t,n_forced*1)" ' +
        //   //   newFilePath,
        //   '-i ' + video.path + ' -movflags +faststart ' + newFilePath,
        // )
        //   .then(async session => {
        //     const returnCode = await session.getReturnCode();
        //     const dateOfPractice: Date = session.getCreateTime();

        //     if (ReturnCode.isSuccess(returnCode)) {
        //       // SUCCESS
        //       try {
        //         const duration = await getDuration(newFilePath);
        //         const formattedDuration = await getFormattedDuration(
        //           newFilePath,
        //         );
        //         const formattedDurationWithoutMillisecond =
        //           formattedDuration?.split('.')[0];

        //         let practiceLogs: PracticeLogsType;
        //         const savedPracticeLogs: string | null =
        //           await AsyncStorage.getItem('practice_logs');

        //         if (savedPracticeLogs !== null) {
        //           practiceLogs = JSON.parse(savedPracticeLogs);

        //           const newLogData: PracticeLogType = {
        //             id: practiceLogs.nextID,
        //             filePath: newFilePath,
        //             fileName: 'Practice log ' + practiceLogs.nextID,
        //             directory: directory,
        //             duration: duration,
        //             formattedDuration: formattedDuration,
        //             formattedDurationWithoutMillisecond:
        //               formattedDurationWithoutMillisecond,
        //             date: dateOfPractice,
        //           };
        //           // console.log('newLogData', newLogData);
        //           const newPracticeLogs: PracticeLogsType = {
        //             datas: [...practiceLogs.datas, newLogData],
        //             nextID: practiceLogs.nextID + 1,
        //           };
        //           // console.log('newPracticeLogs', newPracticeLogs);
        //           await AsyncStorage.setItem(
        //             'practice_logs',
        //             JSON.stringify(newPracticeLogs),
        //           );
        //         } else {
        //           const newLogData: PracticeLogType = {
        //             id: 1,
        //             filePath: newFilePath,
        //             fileName: 'Practice log 1',
        //             duration: duration,
        //             directory: directory,
        //             formattedDuration: formattedDuration,
        //             formattedDurationWithoutMillisecond:
        //               formattedDurationWithoutMillisecond,
        //             date: dateOfPractice,
        //           };
        //           await AsyncStorage.setItem(
        //             'practice_logs',
        //             JSON.stringify({datas: [newLogData], nextID: 2}),
        //           );
        //         }
        //       } catch (err) {
        //         console.log(err);
        //       }

        //       console.log('success');
        //     } else if (ReturnCode.isCancel(returnCode)) {
        //       // CANCEL
        //       console.log('cancel');
        //     } else {
        //       // ERROR
        //       console.log('error');
        //     }
        //     // });
        //     Orientation.unlockAllOrientations();
        //     navigation.navigate('VideoPlay', {videoUri: video.path});
        //   })
        //   .catch(err => {
        //     console.log(err);
        //     Alert.alert('Error', 'Issue occured while saving File');
        //   });
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
          // Orientation.unlockAllOrientations();
          navigation.reset({index: 0, routes: [{name: 'Tab'}]});
        },
      },
    ]);
  };

  // if (device == null) return <LoadingScreen />;
  if (isLoading) {
    return <View style={styles.blackScreen} />;
  }
  return (
    <View style={styles.body}>
      {/* <OrientationLocker orientation={'LANDSCAPE'} /> */}
      <Camera
        style={StyleSheet.absoluteFill}
        device={device as CameraDevice}
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
  blackScreen: {
    backgroundColor: 'black',
    flex: 1,
  },
});
