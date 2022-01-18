import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import Video from 'react-native-video';
import {useAndroidBackHandler} from 'react-navigation-backhandler';
import {Alert} from 'react-native';
import {RootStackTrimScreenProps} from '../types/type';

//handle back button to home!

export default function VideoTrimScreen({
  navigation,
  route,
}: RootStackTrimScreenProps) {
  const player = useRef<Video>(null);

  const {videoUri} = route.params;

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

  useAndroidBackHandler(() => {
    checkGoBack();
    return true;
  });

  return (
    <View style={styles.body}>
      <Video
        source={{uri: videoUri}} // Can be a URL or a local file.
        ref={player} // Store reference
        onBuffer={buff => {
          console.log(buff);
        }} // Callback when remote video is buffering
        onError={err => {
          console.log(err);
        }} // Callback when video cannot be loaded
        style={styles.backgroundVideo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
