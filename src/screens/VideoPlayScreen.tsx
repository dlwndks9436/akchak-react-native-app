import React from 'react';
import {View, StyleSheet} from 'react-native';
import {AndroidBackHandler} from 'react-navigation-backhandler';
// import {Alert} from 'react-native';
import {RootStackPlayScreenProps} from '../types/type';
import VideoPlayer from 'react-native-video-player';

//handle back button to home!

// ffmpeg -i input.mp4 -force_key_frames "expr:gte(t,n_forced*1)"  output.mp4
// Solved by forcing adding keyframes to the video.

// https://stackoverflow.com/questions/10328401/html5-how-to-stream-large-mp4-files#comment62603535_10330501
export default function VideoPlayScreen({
  navigation,
  route,
}: RootStackPlayScreenProps) {
  // const player = useRef<Video>(null);

  // const checkGoBack = () => {
  //   Alert.alert('Would you discard this practice?', undefined, [
  //     {text: 'Cancel', style: 'cancel'},
  //     {
  //       text: 'OK',
  //       onPress: () => {
  //         navigation.reset({index: 0, routes: [{name: 'Tab'}]});
  //       },
  //     },
  //   ]);
  // };

  const onBackButtonPressAndroid = () => {
    /*
     *   Returning `true` from `onBackButtonPressAndroid` denotes that we have handled the event,
     *   and react-navigation's lister will not get called, thus not popping the screen.
     *
     *   Returning `false` will cause the event to bubble up and react-navigation's listener will pop the screen.
     * */

    // checkGoBack();
    navigation.reset({index: 0, routes: [{name: 'Tab'}]});
    return true;
  };

  return (
    <AndroidBackHandler onBackPress={onBackButtonPressAndroid}>
      <View style={styles.body}>
        <VideoPlayer
          video={{
            uri: route.params.videoUri,
          }}
          videoWidth={100}
          videoHeight={100}
          showDuration={true}
        />
      </View>
    </AndroidBackHandler>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1, justifyContent: 'center', backgroundColor: '#000000'},
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
