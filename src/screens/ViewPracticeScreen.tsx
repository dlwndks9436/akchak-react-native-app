import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import VideoPlayer from 'react-native-video-controls';
import {RootStackViewPracticeScreenProps} from '../types/type';
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
  interface Practice {
    _id?: number;
    user_id?: number;
    title?: string;
    description?: string;
    duration?: number;
    from_directory?: string;
    practice_time?: number;
    s3_key?: string;
    user: {username: string};
    thumbnailUri?: string;
    views?: string | number;
    createdAt?: string;
  }
  interface PracticeQueryResult {
    practice: Practice;
    signedUrl: string;
  }

  const isFocused = useIsFocused();
  const [practiceId] = useState(route.params.practiceId);
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
    await Api.get('practice/' + practiceId, {
      headers: {Authorization: 'Bearer ' + accessToken},
    })
      .then(res => {
        console.log('practice: ', res.data);
        setPractice(res.data);
        const dateString = res.data.practice.createdAt;
        const miliSec = Date.parse(dateString);
        setDate(new Date(miliSec));
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 404) {
          setErrorText('Practice not found');
        }
      });
    await Api.get('rating/' + practiceId, {
      headers: {Authorization: 'Bearer ' + accessToken},
    })
      .then(res => {
        console.log("user's rating: ", res.data);
        setLike(res.data[0].isLike);
      })
      .catch((err: AxiosError) => {
        if (err.response?.status === 404) {
          setErrorText('Problem occurred during fetching data');
        }
      });
    await Api.get('rating/number', {
      headers: {Authorization: 'Bearer ' + accessToken},
      params: {practiceId},
    })
      .then(res => {
        console.log('likes: ', res.data.count);
        setHasLike(res.data.count);
      })
      .catch(err => {
        console.log(err);
      });
    setIsLoading(false);
  }, [accessToken, practiceId]);

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
    if (state) {
      state.isFullscreen = true;
      videoPlayer?.current?.setState(state);
    }
    Orientation.lockToLandscape();
    setIsFullScreen(true);
  };

  const exitFullScreen = () => {
    console.log('exit full screen');
    let state = videoPlayer?.current?.state;
    if (state) {
      state.isFullscreen = false;
      videoPlayer?.current?.setState(state);
    }
    Orientation.lockToPortrait();
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

    const response = await Api.patch(
      'rating/' + practiceId,
      {isLike: !like},
      {headers: {Authorization: 'Bearer ' + accessToken}},
    );
    await Api.get('rating/number', {
      headers: {Authorization: 'Bearer ' + accessToken},
      params: {practiceId},
    })
      .then(res => {
        console.log('likes: ', res.data.count);
        setHasLike(res.data.count);
        if (response.data[0] === 1) {
          setLike(val => !val);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const deletePractice = async () => {
    closeMenu();
    await Api.delete('practice/' + practiceId, {
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
          <View style={styles.container}>
            <Text>{errorText}</Text>
          </View>
        ) : (
          <View style={styles.container}>
            <StatusBar backgroundColor={'black'} barStyle={'light-content'} />
            <View style={isFullScreen ? styles.fullscreen : styles.embedded}>
              <VideoPlayer
                source={{uri: practice.signedUrl}}
                ref={videoPlayer}
                disableBack={true}
                disableVolume={true}
                paused={true}
                fullscreen={isFullScreen}
                toggleResizeModeOnFullscreen={false}
                onEnterFullscreen={enterFullScreen}
                onExitFullscreen={exitFullScreen}
                fullscreenOrientation={'landscape'}
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
                  }}>
                  <Title>{practice.practice.title}</Title>
                  <Menu
                    visible={visible}
                    onDismiss={closeMenu}
                    anchor={
                      <IconButton icon="dots-vertical" onPress={openMenu} />
                    }>
                    <Menu.Item
                      title="edit"
                      onPress={() => {
                        closeMenu();
                        navigation.navigate('Upload', {
                          id: practiceId.toString(),
                          title: practice.practice.title,
                          description: practice.practice.description,
                        });
                      }}
                    />
                    <Menu.Item title="delete" onPress={deletePractice} />
                  </Menu>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    marginVertical: 10,
                    paddingBottom: 20,
                    borderBottomWidth: 0.5,
                  }}>
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 25}}>
                      {convertUnit(practice.practice.views as number)}
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
                <Text style={{borderBottomWidth: 0.5, paddingBottom: 20}}>
                  {practice.practice.description}
                </Text>
                <View
                  style={{
                    borderBottomWidth: 0.5,
                    height: 40,
                    justifyContent: 'center',
                  }}>
                  <Title>{practice.practice.user.username}</Title>
                </View>
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
    height: Dimensions.get('window').height / 3,
  },
});
