import {StyleSheet, View, Dimensions} from 'react-native';
import React from 'react';
import Video from 'react-native-video';
import {RootStackTrimScreenProps} from '../types/type';
import Orientation, {OrientationLocker} from 'react-native-orientation-locker';
import {AndroidBackHandler} from 'react-navigation-backhandler';
import VideoPlayer from 'react-native-video-controls';

export default function VideoTrimScreen({
  navigation,
  route,
}: RootStackTrimScreenProps) {
  const videoPlayer = React.useRef<Video>(null);

  const {height} = Dimensions.get('screen');

  const onBackButtonPressAndroid = () => {
    Orientation.unlockAllOrientations();
    navigation.goBack();
    return true;
  };

  return (
    <AndroidBackHandler onBackPress={onBackButtonPressAndroid}>
      <OrientationLocker orientation={'PORTRAIT'} />
      <View style={styles.container}>
        <View style={[{height: height / 3}, styles.videoContainer]}>
          <VideoPlayer
            source={{uri: route.params.videoUri}}
            ref={videoPlayer}
            style={styles.backgroundVideo}
          />
        </View>
      </View>
    </AndroidBackHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  videoContainer: {
    width: '100%',
    backgroundColor: 'black',
  },
  backgroundVideo: {
    height: '100%',
    width: '100%',
  },
});
