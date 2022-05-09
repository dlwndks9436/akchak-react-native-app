import {
  Dimensions,
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
  ViewToken,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Dialog,
  FAB,
  Paragraph,
  Portal,
  Searchbar,
  Subheading,
  Title,
  TouchableRipple,
} from 'react-native-paper';
import {Music, RootStackSelectMusicScreenProps} from '../types';
import Api from '../libs/api';
import {useAppSelector} from '../redux/hooks';
import {selectAccessToken} from '../features/user/userSlice';
import {AxiosError} from 'axios';
import NetInfo from '@react-native-community/netinfo';
import {theme} from '../styles/theme';

export default function SelectMusicScreen({
  navigation,
}: RootStackSelectMusicScreenProps): React.ReactElement {
  const [musics, setMusics] = useState<Music[]>([]);
  const [music, setMusic] = useState<Music>();
  const [title, setTitle] = useState<string>('');
  const [visible, setVisible] = useState(false);
  const [created, setCreated] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [minVisibleIndex, setMinVisibleIndex] = useState(0);
  const [isRefreshing] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const viewConfigRef = React.useRef({viewAreaCoveragePercentThreshold: 50});

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const accessToken = useAppSelector(selectAccessToken);

  interface Info {
    viewableItems: ViewToken[];
    changed: ViewToken[];
  }

  const componentDidMount = useCallback(async () => {
    setIsLoading(true);
    try {
      NetInfo.fetch().then(async state => {
        if (state.isConnected) {
          const params = {
            page: 1,
            size: 20,
            title,
          };
          const result = await Api.get('music', {
            headers: {Authorization: 'Bearer ' + accessToken},
            params,
          });
          setIsLoading(false);
          if (result.status === 200) {
            if (result.data && result.data.musics.length > 0) {
              setMusics(result.data.musics);
              setLastPage(result.data.total_pages);
            } else {
              setMusics([]);
            }
          } else {
            setErrorText('문제가 발생했습니다. 다시 시도해주세요');
            setIsError(true);
          }
        } else {
          setErrorText('인터넷이 연결되었는지 확인해주세요');
          setIsError(true);
        }
      });
    } catch (err) {
      console.log('에러1', err);
    }
  }, [accessToken, title]);

  useEffect(() => {
    componentDidMount();
  }, [componentDidMount]);

  const loadMoreData = async () => {
    if (isLoading || currentPage >= lastPage) {
      return;
    }
    const nextPage = currentPage + 1;
    setIsLoading(true);
    try {
      NetInfo.fetch().then(async state => {
        if (state.isConnected) {
          const params = {
            page: nextPage,
            size: 20,
            title,
          };
          const result = await Api.get('music', {
            headers: {Authorization: 'Bearer ' + accessToken},
            params,
          });
          setIsLoading(false);
          if (result.status === 200) {
            if (result.data && result.data.musics.length > 0) {
              setMusics([...musics, ...result.data.musics]);
              setCurrentPage(nextPage);
            }
          } else {
            setErrorText('문제가 발생했습니다. 다시 시도해주세요');
            setIsError(true);
          }
        } else {
          setErrorText('인터넷이 연결되었는지 확인해주세요');
          setIsError(true);
        }
      });
    } catch (err) {
      setMusics([]);
      setIsLoading(false);
    }
  };

  const onItemTouch = (item: Music) => {
    setMusic(item);
    showDialog();
  };

  const selectMusic = async () => {
    hideDialog();
    if (music) {
      await Api.post(
        'goal',
        {musicId: music.id},
        {
          headers: {Authorization: 'Bearer ' + accessToken},
        },
      )
        .then(() => {
          setCreated(true);
        })
        .catch((err: AxiosError) => {
          console.log(err);
          if (err.response?.status === 409) {
            setErrorText('이미 해당 목표를 생성하신 적이 있습니다.');
          } else {
            setErrorText('문제가 발생했습니다. 다시 시도해주세요');
          }
          setIsError(true);
        });
    }
  };

  const navigateToAddMusicScreen = () => {
    navigation.navigate('음악 추가');
  };

  const backToHomeScreen = () => {
    setCreated(false);
    navigation.popToTop();
  };

  const onViewRef = useRef(({viewableItems}: Info) => {
    setMinVisibleIndex(viewableItems[0].index as number);
  });

  const scrollToTop = () => {
    flatListRef.current?.scrollToIndex({
      animated: true,
      index: 0,
      viewPosition: 1,
    });
  };

  const hideError = () => {
    setIsError(false);
  };

  const LoadingIndicator = () => (
    <View style={styles.loadingIndicator}>
      <ActivityIndicator size="large" color={'white'} />
    </View>
  );

  const Footer = () => (
    <View style={styles.container}>
      <Button
        style={styles.smallButton}
        labelStyle={styles.smallButtonText}
        compact={true}
        onPress={navigateToAddMusicScreen}>
        찾으시는 음악이 없나요?
      </Button>
    </View>
  );

  const renderItem: ListRenderItem<Music> = ({item}) => (
    <TouchableRipple
      style={styles.listItemContainer}
      rippleColor={theme.colors.primary}
      onPress={() => {
        onItemTouch(item);
      }}>
      <View>
        <Subheading style={{color: '#333333'}}>{item.title}</Subheading>
        <Paragraph style={{color: '#999999'}}>{item.artist}</Paragraph>
      </View>
    </TouchableRipple>
  );

  return (
    <View style={styles.container}>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Content>
            <Paragraph>{music?.title}을 연습하시겠습니까?</Paragraph>
          </Dialog.Content>
          <View style={styles.actionContainer}>
            <Dialog.Actions>
              <Button onPress={selectMusic}>네</Button>
            </Dialog.Actions>
            <Dialog.Actions>
              <Button onPress={hideDialog}>아니요</Button>
            </Dialog.Actions>
          </View>
        </Dialog>
        <Dialog visible={created} onDismiss={backToHomeScreen}>
          <Dialog.Content>
            <Paragraph>새로운 목표를 생성하셨습니다</Paragraph>
          </Dialog.Content>
          <View style={styles.actionContainer}>
            <Dialog.Actions>
              <Button onPress={backToHomeScreen}>확인</Button>
            </Dialog.Actions>
          </View>
        </Dialog>
        <Dialog visible={isError} onDismiss={hideError}>
          <Dialog.Content>
            <Paragraph>{errorText}</Paragraph>
          </Dialog.Content>
          <View style={styles.actionContainer}>
            <Dialog.Actions>
              <Button onPress={hideError}>확인</Button>
            </Dialog.Actions>
          </View>
        </Dialog>
      </Portal>
      <FlatList
        ref={flatListRef}
        data={musics}
        extraData={musics}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.1}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'never'}
        onRefresh={componentDidMount}
        refreshing={isRefreshing}
        contentContainerStyle={{
          width: Dimensions.get('window').width,
        }}
        ListHeaderComponent={
          <View style={styles.container}>
            <Title style={styles.title}>연습하실 음악을 선택해주세요</Title>
            <Searchbar
              style={styles.inputContainer}
              value={title}
              onChangeText={setTitle}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: Dimensions.get('window').width / 1.2,
                paddingHorizontal: 10,
              }}></View>
          </View>
        }
        ListFooterComponent={isLoading ? <LoadingIndicator /> : <Footer />}
      />
      <FAB
        icon="chevron-up"
        small
        style={styles.fab}
        onPress={scrollToTop}
        visible={minVisibleIndex !== 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {marginTop: 30, marginBottom: 50},
  inputContainer: {
    width: Dimensions.get('window').width / 1.2,
    backgroundColor: '#dfdfdf',
    marginBottom: 20,
    borderRadius: 50,
  },
  inputText: {
    color: '#333333',
    paddingHorizontal: 20,
  },
  nextButton: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    marginTop: Dimensions.get('window').height / 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '900',
    height: 70,
    textAlignVertical: 'center',
  },
  smallButton: {
    marginVertical: 10,
  },
  smallButtonText: {
    color: '#999999',
  },
  listItemContainer: {
    width: Dimensions.get('window').width / 1.2,
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 0.2,
    borderColor: '#999999',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
    height: 40,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  loadingIndicator: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    opacity: 0.7,
    backgroundColor: theme.colors.primary,
  },
});
