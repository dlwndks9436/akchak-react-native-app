import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {RootStackTrimScreenProps} from '../types/type';
import Orientation, {OrientationLocker} from 'react-native-orientation-locker';
import {AndroidBackHandler} from 'react-navigation-backhandler';
import VideoPlayer from 'react-native-video-controls';
import {FFmpegKit} from 'ffmpeg-kit-react-native';
import {formatDuration} from '../utils';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function VideoTrimScreen({
  navigation,
  route,
}: RootStackTrimScreenProps) {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(route.params.duration);
  const [thumbnailUri, setThumbnailUri] = useState<string>();
  const [videoUri] = useState(route.params.videoUri);

  const videoPlayer = React.useRef<VideoPlayer>(null);
  const imageRef = React.useRef<Image>(null);

  const {height} = Dimensions.get('screen');

  const onBackButtonPressAndroid = () => {
    Orientation.unlockAllOrientations();
    navigation.goBack();
    return true;
  };

  const getThumbnailWithTime = (seconds: number) => {
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
      '-i ' + videoUri + ' -ss ' + seconds + ' -vframes 1 -q:v 2 -y ' + jpgUri,
    ).then(session => {
      console.log(session);
      setThumbnailUri('file://' + jpgUri);
    });
  };

  return (
    <AndroidBackHandler onBackPress={onBackButtonPressAndroid}>
      <OrientationLocker orientation={'PORTRAIT'} />
      <View style={styles.container}>
        <View style={[{height: height / 3}, styles.videoContainer]}>
          <VideoPlayer
            source={{uri: videoUri}}
            ref={videoPlayer}
            style={styles.backgroundVideo}
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
          <Text style={styles.timeText}>
            {formatDuration(Math.floor(startTime))}
          </Text>
          <Text style={styles.timeText}>
            {formatDuration(Math.floor(endTime))}
          </Text>
        </View>
        <View style={styles.setTimeContainer}>
          <TouchableOpacity
            style={styles.setButton}
            onPress={() => {
              if (videoPlayer.current?.state.currentTime! < endTime) {
                setStartTime(videoPlayer.current?.state!.currentTime!);
              }
            }}>
            <MaterialCommunityIcon name="contain-start" size={30} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.setButton}
            onPress={() => {
              if (videoPlayer.current?.state.currentTime! > startTime)
                setEndTime(videoPlayer.current?.state!.currentTime!);
            }}>
            <MaterialCommunityIcon name="contain-end" size={30} />
          </TouchableOpacity>
        </View>
        <View style={styles.imageControl}>
          <View
            style={{
              height: height / 3,
              width: '100%',
            }}>
            <Image
              source={{uri: thumbnailUri}}
              style={styles.thumbnail}
              ref={imageRef}
            />
            <TouchableOpacity
              style={{
                position: 'absolute',
                alignSelf: 'center',
                bottom: height / 7,
                backgroundColor: '#ffffff99',
                borderRadius: 5,
                padding: 10,
              }}
              onPress={() => {
                getThumbnailWithTime(videoPlayer.current?.state.currentTime!);
              }}>
              <Text style={styles.setButtonText}>Set thumbnail</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </AndroidBackHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    width: '100%',
    backgroundColor: 'black',
    marginBottom: 20,
  },
  backgroundVideo: {
    height: '100%',
    width: '100%',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
  },
  setTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
  },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: 50,
  },
  imageControl: {
    alignItems: 'center',
  },
  setButton: {
    borderRadius: 5,
  },
  setButtonText: {
    fontSize: 20,
  },
  thumbnail: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  timeText: {
    fontSize: 20,
  },
});
