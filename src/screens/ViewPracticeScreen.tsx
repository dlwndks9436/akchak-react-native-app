import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import VideoPlayer from 'react-native-video-controls';
import {RootStackViewPracticeScreenProps} from '../types';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  IconButton,
  Menu,
  Text,
  Title,
} from 'react-native-paper';
import Api from '../libs/api';
import {useAppSelector} from '../redux/hooks';
import {selectAccessToken} from '../features/user/userSlice';
import {AxiosError} from 'axios';
import {convertUnit} from '../utils';
import Orientation from 'react-native-orientation-locker';
import {AndroidBackHandler} from 'react-navigation-backhandler';
import {PressableOpacity} from 'react-native-pressable-opacity';
import {useIsFocused} from '@react-navigation/native';

export default function ViewPracticeScreen({
  navigation,
  route,
}: RootStackViewPracticeScreenProps) {
  interface PracticeQueryResult {
    playerName: string;
    phraseTitle?: string;
    phraseSubheading?: string;
    bookTitle?: string;
    musicTitle?: string;
    musicArtist?: string;
    view: number;
    memo: string;
    createdAt: string;
    videoUrl: string;
    isOwner: boolean;
  }

  const isFocused = useIsFocused();
  const [practiceLogId] = useState(route.params.practiceLogId);
  const [isLoading, setIsLoading] = useState(true);
  const [practice, setPractice] = useState<PracticeQueryResult>();
  const [errorText, setErrorText] = useState<string>();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [like, setLike] = useState<boolean>(false);
  const [hasLike, setHasLike] = useState<number>(0);
  const [date, setDate] = useState<Date>();
  const [visible, setVisible] = useState(false);
  const accessToken = useAppSelector(selectAccessToken);

  const componentDidMount = useCallback(async () => {
    Api.get('/practicelog/' + practiceLogId, {
      headers: {Authorization: 'Bearer ' + accessToken},
    })
      .then(res => {
        console.log('practice: ', res.data);
        setPractice(res.data);
        const dateString = res.data.createdAt;
        const miliSec = Date.parse(dateString);
        console.log(miliSec);
        setDate(new Date(miliSec));
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 404) {
          setErrorText('Practice not found');
        }
      });
    Api.get('/like/' + practiceLogId, {
      headers: {Authorization: 'Bearer ' + accessToken},
    })
      .then(res => {
        console.log("user's rating: ", res.data[0].is_like);
        setLike(res.data[0].is_like);
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 404) {
          setErrorText('Problem occurred during fetching data');
        }
      });
    Api.get('like/count', {
      headers: {Authorization: 'Bearer ' + accessToken},
      params: {practiceLogId},
    })
      .then(res => {
        console.log('likes: ', res.data.count);
        setHasLike(res.data.count);
      })
      .catch(err => {
        console.log(err);
      });
    setIsLoading(false);
  }, [accessToken, practiceLogId]);

  useEffect(() => {
    if (isFocused) {
      componentDidMount();
    }
  }, [componentDidMount, isFocused]);

  useEffect(() => {
    Orientation.getAutoRotateState(auto => {
      if (auto) {
        Orientation.addDeviceOrientationListener(() => {
          Orientation.unlockAllOrientations();
        });
        Orientation.addOrientationListener(orientation => {
          console.log('orientation: ', orientation);
          if (
            orientation === 'LANDSCAPE-LEFT' ||
            orientation === 'LANDSCAPE-RIGHT'
          ) {
            console.log('landscape mode');

            let state = videoPlayer?.current?.state;
            if (state) {
              state.isFullscreen = true;
              videoPlayer?.current?.setState(state);
            }
            setIsFullScreen(true);
          } else if (orientation === 'PORTRAIT') {
            console.log('portrait mode');

            setIsFullScreen(false);
            let state = videoPlayer?.current?.state;
            if (state) {
              state.isFullscreen = false;
              videoPlayer?.current?.setState(state);
            }
          }
        });
      } else {
        Orientation.lockToPortrait();
      }
    });
    return () => {
      Orientation.removeAllListeners();
      Orientation.unlockAllOrientations();
      console.log('Orientation listeners removed');
    };
  }, []);

  const enterFullScreen = () => {
    console.log('enter full screen');
    let state = videoPlayer?.current?.state;
    console.log(state);
    const newState = {...state, isFullScreen: true};

    videoPlayer?.current?.setState(newState);
    setIsFullScreen(true);
  };

  const exitFullScreen = () => {
    console.log('exit full screen');
    let state = videoPlayer?.current?.state;
    console.log(state);
    const newState = {...state, isFullScreen: false};
    videoPlayer?.current?.setState(newState);
    setIsFullScreen(false);
  };

  const onBackButtonPressAndroid = () => {
    if (isFullScreen) {
      setIsFullScreen(false);
      let state = videoPlayer?.current?.state;
      if (state) {
        state.isFullscreen = false;
        videoPlayer?.current?.setState(state);
      }
      Orientation.lockToPortrait();
      return true;
    }
    return false;
  };

  const toggleLike = async () => {
    console.log('like: ', like);
    try {
      const response = await Api.patch(
        'like/' + practiceLogId,
        {},
        {headers: {Authorization: 'Bearer ' + accessToken}},
      );
      await Api.get('like/count', {
        headers: {Authorization: 'Bearer ' + accessToken},
        params: {practiceLogId},
      }).then(res => {
        console.log('likes: ', res.data.count);
        setHasLike(res.data.count);
        if (response) {
          setLike(response.data.is_like);
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const deletePractice = async () => {
    closeMenu();
    await Api.delete('practicelog/' + practiceLogId, {
      headers: {Authorization: 'Bearer ' + accessToken},
    })
      .then(() => {
        navigation.popToTop();
      })
      .catch(err => console.log(err));
  };

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const videoPlayer = React.useRef<VideoPlayer>(null);
  // const {height} = Dimensions.get('screen');

  return (
    <AndroidBackHandler onBackPress={onBackButtonPressAndroid}>
      <SafeAreaView style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : !practice ? (
          <View style={styles.loadingContainer}>
            <Text>{errorText}</Text>
          </View>
        ) : (
          <View style={styles.container}>
            <StatusBar backgroundColor={'black'} barStyle={'light-content'} />
            <View style={isFullScreen ? styles.fullscreen : styles.embedded}>
              <VideoPlayer
                source={{uri: practice.videoUrl}}
                ref={videoPlayer}
                disableBack={true}
                disableVolume={true}
                paused={false}
                fullscreen={isFullScreen}
                toggleResizeModeOnFullscreen={false}
                onEnterFullscreen={enterFullScreen}
                onExitFullscreen={exitFullScreen}
                fullscreenOrientation={'portrait'}
                onEnd={() => {
                  videoPlayer.current?.seekTo(0);
                  videoPlayer.current?.setSeekerPosition(0);
                  const previousState = videoPlayer?.current?.state;
                  const newState = {...previousState, paused: true};
                  videoPlayer.current?.setState(newState);
                }}
              />
            </View>
            {!isFullScreen && (
              <ScrollView contentContainerStyle={{paddingHorizontal: 10}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: 40,
                  }}>
                  <Title>
                    {practice.phraseTitle || practice.musicTitle} -{' '}
                    {practice.phraseSubheading || practice.musicArtist}
                  </Title>
                  {practice.isOwner && (
                    <Menu
                      visible={visible}
                      onDismiss={closeMenu}
                      anchor={
                        <IconButton icon="dots-vertical" onPress={openMenu} />
                      }>
                      <Menu.Item title="삭제" onPress={deletePractice} />
                    </Menu>
                  )}
                </View>
                {practice.bookTitle && <Text>{practice.bookTitle}</Text>}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    paddingVertical: 20,
                    borderBottomWidth: 0.5,
                  }}>
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 25}}>
                      {convertUnit(practice.view as number)}
                    </Text>
                    <Text>views</Text>
                  </View>
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 25}}>
                      {date?.toLocaleDateString()}
                    </Text>
                    <Text>Created at</Text>
                  </View>
                  <PressableOpacity
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={toggleLike}>
                    <IconButton
                      icon={like ? 'thumb-up' : 'thumb-up-outline'}
                      style={{marginVertical: -5}}
                    />
                    <Text>{hasLike}</Text>
                  </PressableOpacity>
                </View>
                <View
                  style={{
                    borderBottomWidth: 0.5,
                    height: 40,
                    justifyContent: 'center',
                  }}>
                  <Title>{practice.playerName}</Title>
                </View>
                <Text style={styles.memo}>{practice.memo}</Text>
              </ScrollView>
            )}
          </View>
        )}
      </SafeAreaView>
    </AndroidBackHandler>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  videoContainer: {
    width: '100%',
    backgroundColor: 'black',
  },
  videoPlayer: {
    height: '100%',
    width: '100%',
  },
  fullscreen: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  embedded: {
    position: 'relative',
    height: Dimensions.get('window').height / 2,
  },
  memo: {
    paddingTop: 5,
  },
});
