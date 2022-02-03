import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RootStackTrimScreenProps} from '../types/type';
import Orientation, {OrientationLocker} from 'react-native-orientation-locker';
import {AndroidBackHandler} from 'react-navigation-backhandler';
import VideoPlayer from 'react-native-video-controls';
import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import {formatDuration} from '../utils';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFS from 'react-native-fs';

export default function VideoTrimScreen({
  navigation,
  route,
}: RootStackTrimScreenProps) {
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(route.params.duration);
  const [thumbnailUri, setThumbnailUri] = useState<string>();
  const [videoUri] = useState(route.params.videoUri);
  const [trimmedVideoUri, setTrimmedVideoUri] = useState<string>();

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

  const trimVideo = () => {
    console.log('trimming start');
    const previousTrimmedVideoUri = trimmedVideoUri;

    const milsec = new Date().getMilliseconds();
    const sec = new Date().getSeconds();
    const newUri = route.params.directory + '/practice' + sec + milsec + '.mp4';
    FFmpegKit.execute(
      '-i ' +
        route.params.videoUri +
        ' -ss ' +
        startTime +
        ' -t ' +
        endTime +
        ' -async 1 -c copy ' +
        newUri,
    )
      .then(async session => {
        const returnCode = await session.getReturnCode();
        if (ReturnCode.isSuccess(returnCode)) {
          setTrimmedVideoUri(newUri);
          console.log(newUri);
          if (previousTrimmedVideoUri) {
            RNFS.unlink(previousTrimmedVideoUri)
              .then(() => console.log('PREVIOUS TRIMMED VIDEO DELETED'))
              .catch(err => {
                console.log(err);
              });
          }
          console.log('trimming finish');
        }
      })
      .catch(err => {
        console.log(err);
      });
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
      '-i ' + videoUri + ' -ss ' + seconds + ' -vframes 1 -q:v 2 -y ' + jpgUri,
    ).then(session => {
      console.log(session);
      setThumbnailUri('file://' + jpgUri);
      if (previousThumbnailUri) {
        RNFS.unlink(previousThumbnailUri)
          .then(() => console.log('PREVIOUS THUMBNAIL DELETED'))
          .catch(err => {
            console.log(err);
          });
      }
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
          <Text style={styles.timeText}>
            {formatDuration(Math.floor(startTime))}
          </Text>
          <Text style={styles.trimText}>Trim Video</Text>
          <Text style={styles.timeText}>
            {formatDuration(Math.floor(endTime))}
          </Text>
        </View>
        <View style={styles.setTimeContainer}>
          <TouchableOpacity
            style={styles.setButton}
            onPress={() => {
              if (videoPlayer.current?.state.currentTime! < endTime) {
                try {
                  setStartTime(videoPlayer.current?.state!.currentTime!);
                  trimVideo();
                } catch (error) {
                  console.log(error);
                }
              }
            }}>
            <MaterialCommunityIcon name="contain-start" size={40} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.previewButton}
            onPress={() => {
              if (trimmedVideoUri) {
                navigation.navigate('VideoPlay', {
                  videoUri: trimmedVideoUri,
                });
              }
            }}>
            <Text style={styles.previewText}>Preview</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.setButton}
            onPress={() => {
              if (videoPlayer.current?.state.currentTime! > startTime) {
                try {
                  setEndTime(videoPlayer.current?.state!.currentTime!);
                  trimVideo();
                } catch (error) {
                  console.log(error);
                }
              }
            }}>
            <MaterialCommunityIcon name="contain-end" size={40} />
          </TouchableOpacity>
        </View>
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
            <TouchableOpacity
              style={{
                position: 'absolute',
                alignSelf: 'center',
                bottom: height / 8,
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
        <View style={styles.pageNavigator}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <MaterialCommunityIcon name="chevron-left" size={30} />
            <Text style={styles.pageNavigatorText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.pageNavigatorText}>Next</Text>
            <MaterialCommunityIcon name="chevron-right" size={30} />
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  setTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
    borderTopWidth: 1,
    borderTopColor: '#d3d3d3',
  },
  imageControl: {
    alignItems: 'center',
  },
  setButton: {
    flex: 2,
    alignItems: 'center',
  },
  setButtonText: {
    fontSize: 20,
    fontFamily: 'Orbitron-VariableFont_wght',
  },
  thumbnail: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
  timeText: {
    fontSize: 15,
  },
  previewButton: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: '#d3d3d3',
    borderRightColor: '#d3d3d3',
  },
  previewText: {
    fontSize: 20,
    fontFamily: 'Orbitron-VariableFont_wght',
  },
  pageNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pageNavigatorText: {
    fontFamily: 'Orbitron-VariableFont_wght',
    fontSize: 20,
  },
  trimText: {
    fontFamily: 'Orbitron-VariableFont_wght',
  },
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
});
