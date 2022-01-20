import React from 'react';
import {View, StyleSheet} from 'react-native';
import {AndroidBackHandler} from 'react-navigation-backhandler';
import {Alert} from 'react-native';
import {RootStackTrimScreenProps} from '../types/type';
import VideoPlayer from 'react-native-video-player';

//handle back button to home!

export default function VideoTrimScreen({
  navigation,
  route,
}: RootStackTrimScreenProps) {
  // const player = useRef<Video>(null);

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

  const onBackButtonPressAndroid = () => {
    /*
     *   Returning `true` from `onBackButtonPressAndroid` denotes that we have handled the event,
     *   and react-navigation's lister will not get called, thus not popping the screen.
     *
     *   Returning `false` will cause the event to bubble up and react-navigation's listener will pop the screen.
     * */

    checkGoBack();
    return true;
  };

  return (
    <AndroidBackHandler onBackPress={onBackButtonPressAndroid}>
      <View style={styles.body}>
        <VideoPlayer
          video={{
            uri: route.params.videoUri,
          }}
          videoWidth={200}
          videoHeight={100}
          showDuration={true}
          fullScreenOnLongPress={true}
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
