import {StyleSheet, View, Dimensions, StatusBar} from 'react-native';
import React, {useState} from 'react';
import {RootStackCreateThumbnailScreenProps} from '../types';
import Orientation from 'react-native-orientation-locker';
import {AndroidBackHandler} from 'react-navigation-backhandler';
import VideoPlayer from 'react-native-video-controls';
import {FFmpegKit} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';
import {Button} from 'react-native-paper';

export default function CreateThumbnailScreen({
  navigation,
  route,
}: RootStackCreateThumbnailScreenProps) {
  const [videoUri] = useState(route.params.video.path);

  const videoPlayer = React.useRef<VideoPlayer>(null);

  const {height} = Dimensions.get('screen');

  const onBackButtonPressAndroid = () => {
    Orientation.unlockAllOrientations();
    navigation.goBack();
    return true;
  };

  const getThumbnailWithTime = async (seconds: number) => {
    const jpgUri = videoUri
      .split('.')
      .map(val => {
        if (val === 'mp4') {
          return 'jpg';
        } else {
          return val;
        }
      })
      .join('.');
    console.log('이미지 uri: ', jpgUri);

    await RNFS.unlink(jpgUri)
      .then(() => console.log('PREVIOUS THUMBNAIL DELETED'))
      .catch(err => {
        console.log(err);
      });

    FFmpegKit.execute(
      '-ss ' + seconds + ' -i ' + videoUri + ' -frames:v 1 -q:v 2 ' + jpgUri,
    ).then(session => {
      console.log(session);
      navigation.navigate('섬네일 확인', {
        goal: route.params.goal,
        video: route.params.video,
        creationTime: route.params.creationTime,
        practiceTime: route.params.practiceTime,
        thumbnailPath: jpgUri,
      });
    });
  };

  return (
    <AndroidBackHandler onBackPress={onBackButtonPressAndroid}>
      <View style={styles.container}>
        <StatusBar backgroundColor={'black'} barStyle={'light-content'} />
        <View style={[{height: height / 1.5}, styles.videoContainer]}>
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
        <Button
          style={styles.bigButton}
          mode="outlined"
          onPress={() => {
            getThumbnailWithTime(videoPlayer.current?.state.currentTime!);
          }}>
          선택하기
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
  bigButton: {borderRadius: 0},
});
