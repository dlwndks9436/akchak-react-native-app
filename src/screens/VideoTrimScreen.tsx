import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// import Video from 'react-native-video';
import {AndroidBackHandler} from 'react-navigation-backhandler';
import {Alert} from 'react-native';
import {RootStackTrimScreenProps, RootStackParamList} from '../types/type';
import VideoPlayer from 'react-native-video-controls';
import {StackNavigationProp} from '@react-navigation/stack';

//handle back button to home!

export default class VideoTrimScreen extends Component {
  // const player = useRef<Video>(null);
  videoUri: string;
  navigation: StackNavigationProp<RootStackParamList, 'VideoTrim'>;

  constructor(props: RootStackTrimScreenProps) {
    super(props);
    console.log(props.route);
    this.videoUri = props.route.params.videoUri;

    this.navigation = props.navigation;
    this.checkGoBack = this.checkGoBack.bind(this);
    this.onBackButtonPressAndroid = this.onBackButtonPressAndroid.bind(this);
  }

  checkGoBack = () => {
    Alert.alert('Would you discard this practice?', undefined, [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'OK',
        onPress: () => {
          this.navigation.reset({index: 0, routes: [{name: 'Tab'}]});
        },
      },
    ]);
  };

  onBackButtonPressAndroid = () => {
    /*
     *   Returning `true` from `onBackButtonPressAndroid` denotes that we have handled the event,
     *   and react-navigation's lister will not get called, thus not popping the screen.
     *
     *   Returning `false` will cause the event to bubble up and react-navigation's listener will pop the screen.
     * */

    this.checkGoBack();
    return true;
  };

  render(): React.ReactNode {
    return (
      <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>
        <View style={styles.body}>
          <VideoPlayer source={{uri: this.videoUri}} />
        </View>
      </AndroidBackHandler>
    );
  }
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
