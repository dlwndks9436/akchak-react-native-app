import {StyleSheet, View, Dimensions, StatusBar} from 'react-native';
import React, {useState} from 'react';
import {RootStackTrimScreenProps} from '../types';
import VideoPlayer from 'react-native-video-controls';
import {FFmpegKit, FFprobeKit, ReturnCode} from 'ffmpeg-kit-react-native';
import {formatDuration} from '../utils';
import RNFS from 'react-native-fs';
import {
  ActivityIndicator,
  Button,
  Dialog,
  Modal,
  Paragraph,
  Portal,
  Text,
} from 'react-native-paper';
import {AndroidBackHandler} from 'react-navigation-backhandler';
import {theme} from '../styles/theme';

export default function VideoTrimScreen({
  navigation,
  route,
}: RootStackTrimScreenProps) {
  const [startTime, setStartTime] = useState<number>();
  const [endTime, setEndTime] = useState<number>();
  const [videoUri] = useState(route.params.media.path);
  const [visible, setVisible] = useState(false);
  const [dialogText, setDialogText] = useState('');
  const [backPressed, setBackPressed] = useState(false);
  const [modalVisible, setModelVisible] = useState(false);

  const videoPlayer = React.useRef<VideoPlayer>(null);

  const {height} = Dimensions.get('screen');

  const onBackButtonPressAndroid = () => {
    setBackPressed(true);
    return true;
  };

  const setStart = () => {
    if (!endTime || videoPlayer.current?.state.currentTime! < endTime) {
      try {
        setStartTime(videoPlayer.current?.state!.currentTime!);
        console.log(videoPlayer.current?.state!.currentTime!);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const setEnd = () => {
    if (!startTime || videoPlayer.current?.state.currentTime! > startTime) {
      try {
        setEndTime(videoPlayer.current?.state!.currentTime!);
        console.log(videoPlayer.current?.state!.currentTime!);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const trimVideo = () => {
    if (!startTime || !endTime) {
      setDialogText('영상이 시작하는 지점과 끝나는 지점을 정해주세요');
      showDialog();
      return;
    }
    console.log('trimming start');
    showModal();

    console.log('start time: ', startTime, 'end time: ', endTime);

    const currentDateTime = new Date().getTime().toString();
    const newFileName = currentDateTime + '.mp4';
    const newUri = 'file://' + RNFS.ExternalDirectoryPath + '/' + newFileName;
    FFmpegKit.execute(
      '-i ' +
        route.params.media.path +
        ' -ss ' +
        startTime +
        ' -to ' +
        endTime +
        ' -async 1 -c copy ' +
        newUri,
    )
      .then(async session => {
        const returnCode = await session.getReturnCode();
        if (ReturnCode.isSuccess(returnCode)) {
          const fileData = await FFprobeKit.execute(
            `-v quiet -print_format json -show_format -show_streams ${newUri}`,
          );
          const dataStr = await fileData.getOutput();
          console.log('편집된 video metadata: ', dataStr);
          const data = JSON.parse(dataStr);

          console.log('duration: ', data.format.duration);
          console.log('file size: ', data.format.size);
          console.log(newUri);

          hideModal();
          console.log('trimming finish');
          navigation.navigate('VideoPlay', {
            goal: route.params.goal,
            video: {
              duration: parseFloat(data.format.duration as string),
              fileSize: Math.ceil(
                parseInt(data.format.size as string) / 1000000,
              ),
              path: newUri,
              fileName: currentDateTime,
              fileNameWithExt: newFileName,
            },
            creationTime: route.params.creationTime,
            practiceTime: route.params.practiceTime,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const hideNotice = () => setBackPressed(false);

  const showModal = () => setModelVisible(true);
  const hideModal = () => setModelVisible(false);

  const goBackToHome = () => {
    navigation.popToTop();
  };

  return (
    <AndroidBackHandler onBackPress={onBackButtonPressAndroid}>
      <View style={styles.container}>
        <StatusBar backgroundColor={'black'} barStyle={'light-content'} />
        <View style={[{height: height / 1.5}, styles.videoContainer]}>
          <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Content>
                <Paragraph>{dialogText}</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog}>OK</Button>
              </Dialog.Actions>
            </Dialog>
            <Dialog visible={backPressed} onDismiss={hideNotice}>
              <Dialog.Content>
                <Paragraph>
                  중단하시면 녹화한 영상이 저장되지 않습니다. 정말
                  취소하시겠습니까?
                </Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={goBackToHome}>네</Button>
              </Dialog.Actions>
              <Dialog.Actions>
                <Button onPress={hideNotice}>아니요</Button>
              </Dialog.Actions>
            </Dialog>
            <Modal
              visible={modalVisible}
              onDismiss={hideModal}
              contentContainerStyle={styles.modal}>
              <ActivityIndicator
                animating={true}
                color={theme.colors.primary}
                size="large"
              />
            </Modal>
          </Portal>
          <VideoPlayer
            source={{uri: videoUri}}
            ref={videoPlayer}
            style={styles.videoPlayer}
            disableFullscreen={true}
            disableBack={true}
            paused={true}
            onEnd={() => {
              videoPlayer.current?.seekTo(0);
              videoPlayer.current?.setSeekerPosition(0);
              const previousState = videoPlayer?.current?.state;
              const newState = {...previousState, paused: true};
              videoPlayer.current?.setState(newState);
            }}
          />
        </View>
        <View style={styles.timeContainer}>
          <Text>
            {startTime !== undefined && formatDuration(Math.floor(startTime))}
          </Text>
          <Text>
            {endTime !== undefined && formatDuration(Math.floor(endTime))}
          </Text>
        </View>
        <View style={styles.setTimeContainer}>
          <Button style={styles.smallButton} mode="outlined" onPress={setStart}>
            현재화면부터 시작하기
          </Button>
          <Button style={styles.smallButton} mode="outlined" onPress={setEnd}>
            현재화면에서 종료하기
          </Button>
        </View>
        <Button style={styles.bigButton} mode="outlined" onPress={trimVideo}>
          편집하기
        </Button>
      </View>
    </AndroidBackHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  videoContainer: {
    width: '100%',
    backgroundColor: 'black',
  },
  videoPlayer: {
    height: '100%',
    width: '100%',
  },
  backgroundVideo: {
    height: '100%',
    width: '100%',
    backgroundColor: 'black',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  setTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  thumbnail: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 20,
    marginVertical: 10,
  },
  smallButton: {flex: 1, borderRadius: 0},
  bigButton: {borderRadius: 0},
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
  },
});
