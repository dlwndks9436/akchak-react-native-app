import {StyleSheet, View} from 'react-native';
import React from 'react';
import Video from 'react-native-video';
import {RootStackTrimScreenProps} from '../types/type';

export default function VideoTrimScreen({route}: RootStackTrimScreenProps) {
  return (
    <View style={styles.container}>
      <Video
        source={{uri: route.params.videoUri}}
        style={styles.backgroundVideo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
