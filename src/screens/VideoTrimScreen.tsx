import {StyleSheet, View, Dimensions, Image, StatusBar} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RootStackTrimScreenProps} from '../types/type';
import Orientation, {OrientationLocker} from 'react-native-orientation-locker';
import {AndroidBackHandler} from 'react-navigation-backhandler';
import VideoPlayer from 'react-native-video-controls';
import {FFmpegKit, FFprobeKit, ReturnCode} from 'ffmpeg-kit-react-native';
import {formatDuration} from '../utils';
import RNFS from 'react-native-fs';
import {Button, Dialog, Paragraph, Portal, Text} from 'react-native-paper';

export default function VideoTrimScreen({
  navigation,
  route,
}: RootStackTrimScreenProps) {
  const [startTime, setStartTime] = useState<number>();
  const [endTime, setEndTime] = useState<number>();
  const [thumbnailUri, setThumbnailUri] = useState<string>();
  const [videoUri] = useState(route.params.videoUri);
  const [trimmedVideoUri, setTrimmedVideoUri] = useState<string>();
  const [duration, setDuration] = useState<number>();
  const [fileName, setFileName] = useState<string>('');
  const [thumbnailName, setThumbnailName] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const [dialogText, setDialogText] = useState('');

  const videoPlayer = React.useRef<VideoPlayer>(null);
  const imageRef = React.useRef<Image>(null);

  const {height} = Dimensions.get('screen');

  useEffect(() => {
    const directoryPath = route.params.directory;

    RNFS.readDir(directoryPath)
      .then(files => {
        files.forEach(file => {
          if (file.name.includes('thumbnail')) {
            setThumbnailUri('file://' + file.path);
            const jpgName = file.path.split('/').pop() as string;
            setThumbnailName(jpgName);
            return false;
          }
        });
      })
      .catch(err => console.log(err));
  }, [route.params.directory]);

  const onBackButtonPressAndroid = () => {
    Orientation.unlockAllOrientations();
    navigation.goBack();
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
      setDialogText(
        '"Start time" and "End time" needs to be set to proceed video trimming.',
      );
      showDialog();
      return;
    }
    console.log('trimming start');
    const previousTrimmedVideosUri = new Array();
    RNFS.readDir(route.params.directory).then(videos => {
      videos.forEach(video => {
        if (video.name.includes('editted')) {
          previousTrimmedVideosUri.push(video.path);
        }
      });
    });
    console.log('start time: ', startTime, 'end time: ', endTime);

    const milsec = new Date().getMilliseconds();
    const sec = new Date().getSeconds();
    const newFileName = 'practice_editted' + sec + milsec + '.mp4';
    setFileName(newFileName);
    const newUri = route.params.directory + '/' + newFileName;
    FFmpegKit.execute(
      '-i ' +
        route.params.videoUri +
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
          setTrimmedVideoUri(newUri);
          const time = await FFprobeKit.execute(
            `-i ${newUri} -show_entries format=duration -v quiet -of csv="p=0"`,
          );
          const durStr = await time.getOutput();
          setDuration(Number.parseFloat(durStr));
          console.log(newUri);
          if (previousTrimmedVideosUri.length > 0) {
            previousTrimmedVideosUri.forEach(videoPath => {
              RNFS.unlink(videoPath)
                .then(() => console.log('PREVIOUS TRIMMED VIDEO DELETED'))
                .catch(err => {
                  console.log(err);
                });
            });
          }
          console.log('trimming finish');
          setDialogText('Video trimming successfully done');
          showDialog();
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const preview = () => {
    if (trimmedVideoUri) {
      navigation.navigate('VideoPlay', {
        videoUri: trimmedVideoUri,
      });
    } else {
      setDialogText(
        'There is no video trimmed to preview. Trim video and try again.',
      );
      showDialog();
      return;
    }
  };

  const getThumbnailWithTime = (seconds: number) => {
    const previousThumbnailUri = thumbnailUri;

    console.log(videoUri);
    const jpgUri = videoUri
      .split('/')
      .map(val => {
        if (val === 'practice.mp4') {
          const milsec = new Date().getMilliseconds();
          const sec = new Date().getSeconds();
          return 'thumbnail' + sec + milsec + '.jpg';
        } else return val;
      })
      .join('/');
    console.log(jpgUri);

    FFmpegKit.execute(
      '-ss ' + seconds + ' -i ' + videoUri + ' -frames:v 1 -q:v 2 ' + jpgUri,
    ).then(session => {
      console.log(session);
      setThumbnailUri('file://' + jpgUri);
      const jpgName = jpgUri.split('/').pop() as string;
      setThumbnailName(jpgName);
      if (previousThumbnailUri) {
        RNFS.unlink(previousThumbnailUri)
          .then(() => console.log('PREVIOUS THUMBNAIL DELETED'))
          .catch(err => {
            console.log(err);
          });
      }
    });
  };

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const navigateToUploadScreen = () => {
    if (trimmedVideoUri && thumbnailUri && duration) {
      navigation.navigate('Upload', {
        trimmedVideoUri,
        thumbnailUri,
        duration,
        practiceTime: route.params.duration,
        id: route.params.id,
        fileName,
        thumbnailName,
        directory: route.params.fileName,
      });
    } else if (!trimmedVideoUri) {
      setDialogText('Please trim video to continue.');
      showDialog();
    } else if (!thumbnailUri) {
      setDialogText('Please set thumbnail to continue');
      showDialog();
    }
  };

  return (
    <AndroidBackHandler onBackPress={onBackButtonPressAndroid}>
      <OrientationLocker orientation={'PORTRAIT'} />
      <View style={styles.container}>
        <StatusBar backgroundColor={'black'} barStyle={'light-content'} />
        <View style={[{height: height / 3}, styles.videoContainer]}>
          <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Content>
                <Paragraph>{dialogText}</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog}>OK</Button>
              </Dialog.Actions>
            </Dialog>
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
            Set Start
          </Button>
          <Button style={styles.smallButton} mode="outlined" onPress={setEnd}>
            Set End
          </Button>
        </View>
        <Button style={styles.bigButton} mode="outlined" onPress={trimVideo}>
          Trim video
        </Button>
        <Button
          style={styles.bigButton}
          mode="outlined"
          onPress={() => {
            getThumbnailWithTime(videoPlayer.current?.state.currentTime!);
          }}>
          Set thumbnail
        </Button>
        <Button style={styles.bigButton} mode="outlined" onPress={preview}>
          Preview
        </Button>
        <View style={styles.imageControl}>
          <View
            style={{
              height: height / 3.5,
              width: '100%',
            }}>
            <Image
              source={{uri: thumbnailUri}}
              style={styles.thumbnail}
              ref={imageRef}
            />
          </View>
        </View>
        <View style={styles.pageNavigator}>
          <Button
            icon="chevron-left"
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            Back
          </Button>
          <Button
            icon="chevron-right"
            onPress={navigateToUploadScreen}
            style={styles.nextButton}
            contentStyle={styles.nextButtonContent}>
            Next
          </Button>
        </View>
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
  imageControl: {
    alignItems: 'center',
  },
  thumbnail: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 20,
    marginVertical: 10,
  },
  pageNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  smallButton: {flex: 1, borderRadius: 0},
  bigButton: {borderRadius: 0},
  backButton: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 20,
  },
  nextButton: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 20,
  },
  nextButtonContent: {flexDirection: 'row-reverse'},
});
