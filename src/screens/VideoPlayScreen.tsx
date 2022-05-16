import React from 'react';
import {View, StyleSheet} from 'react-native';
import {AndroidBackHandler} from 'react-navigation-backhandler';
import {RootStackPlayScreenProps} from '../types';
import VideoPlayer from 'react-native-video-controls';
import {Button} from 'react-native-paper';

export default function VideoPlayScreen({
  navigation,
  route,
}: RootStackPlayScreenProps) {
  const videoPlayer = React.useRef<VideoPlayer>(null);

  const onBackButtonPressAndroid = () => {
    /*
     *   Returning `true` from `onBackButtonPressAndroid` denotes that we have handled the event,
     *   and react-navigation's lister will not get called, thus not popping the screen.
     *
     *   Returning `false` will cause the event to bubble up and react-navigation's listener will pop the screen.
     * */
    return false;
  };

  const navigateToNextScreen = () => {
    navigation.navigate('섬네일 추가', {
      goal: route.params.goal,
      video: route.params.video,
      creationTime: route.params.creationTime,
      practiceTime: route.params.practiceTime,
    });
  };

  return (
    <AndroidBackHandler onBackPress={onBackButtonPressAndroid}>
      <View style={styles.body}>
        <VideoPlayer
          source={{uri: route.params.video.path}}
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
        <Button
          icon="chevron-right"
          style={styles.nextButton}
          onPress={navigateToNextScreen}
          contentStyle={{flexDirection: 'row-reverse'}}>
          다음
        </Button>
      </View>
    </AndroidBackHandler>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1, backgroundColor: '#000000'},
  videoPlayer: {
    height: '100%',
    width: '100%',
  },
  nextButton: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 10,
  },
});
