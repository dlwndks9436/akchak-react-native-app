import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ListRenderItem,
  ImageBackground,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Dialog,
  FAB,
  IconButton,
  Modal,
  Paragraph,
  Portal,
  Text,
  Title,
} from 'react-native-paper';
import Api from '../libs/api';
import {useAppSelector} from '../redux/hooks';
import {selectAccessToken} from '../features/user/userSlice';
import {AxiosError, AxiosResponse} from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import {convertUnit, formatDuration, getElapsedTime} from '../utils/index';
import {RootStackTabScreenProps} from '../types';
import NetInfo from '@react-native-community/netinfo';
import {theme} from '../styles/theme';
import {PressableOpacity} from 'react-native-pressable-opacity';

export default function HomeScreen({navigation}: RootStackTabScreenProps) {
  interface Item {
    id: number;
    playerName: string;
    phraseTitle?: string;
    phraseSubheading?: string;
    bookTitle?: string;
    musicTitle?: string;
    musicArtist?: string;
    view: number | string;
    playbackTime: number;
    thumbnailUrl?: string;
    createdAt: string;
  }
  interface PracticeQueryResult {
    results: Item[];
    totalPages: number;
  }

  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<Item[]>([]);
  const [isRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const accessToken = useAppSelector(selectAccessToken);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');

  const flatListRef = useRef<FlatList>(null);
  const viewConfigRef = React.useRef({viewAreaCoveragePercentThreshold: 50});

  const componentDidMount = useCallback(async () => {
    setIsLoading(true);
    setCurrentPage(1);
    if (!accessToken) {
      return;
    }
    try {
      NetInfo.fetch().then(async state => {
        if (state.isConnected) {
          const params: {
            page: number;
            size: number;
          } = {page: 1, size: 20};
          console.log('componentDidMount start');
          await Api.get('/practicelog', {
            headers: {Authorization: 'Bearer ' + accessToken},
            params,
          })
            .then((response: AxiosResponse) => response.data)
            .then((data: PracticeQueryResult) => {
              if (data) {
                setIsLoading(false);
                console.log('initial isLoading successfully done');
                console.log('loaded data: ', data.results);
                setResults(data.results);
                setLastPage(data.totalPages);
              } else {
                setResults([]);
              }
            })
            .catch((err: AxiosError) => {
              console.error(
                'componentDidMount api error: ',
                err.response?.data,
              );
            });
        } else {
          setErrorText('인터넷이 연결되었는지 확인해주세요');
          setIsError(true);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, [accessToken]);

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
          };
          const result = await Api.get('/practicelog', {
            headers: {Authorization: 'Bearer ' + accessToken},
            params,
          });
          setIsLoading(false);
          if (result.status === 200) {
            if (result.data && result.data.results.length > 0) {
              setResults([...results, ...result.data.results]);
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
      setResults([]);
      setIsLoading(false);
    }
  };

  const hideError = () => {
    setIsError(false);
  };

  const navigateToPracticeScreen = (id: number) => {
    navigation.navigate('ViewPractice', {practiceLogId: id});
  };

  const navigateToSearchScreen = () => {
    navigation.navigate('연습기록 검색');
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToIndex({
      animated: true,
      index: 0,
      viewPosition: 1,
    });
  };

  const Item = ({
    id,
    createdAt,
    phraseTitle,
    playbackTime,
    view,
    thumbnailUrl,
    phraseSubheading,
    bookTitle,
    musicTitle,
    musicArtist,
    playerName,
  }: Item) => (
    <TouchableWithoutFeedback
      onPress={() => {
        navigateToPracticeScreen(id);
      }}>
      <View style={styles.itemContainer}>
        <ImageBackground
          style={styles.thumbnailContainer}
          imageStyle={styles.thumbnail}
          source={{uri: thumbnailUrl}}
          resizeMode="center">
          <View style={styles.durationTextPosition}>
            <Text style={styles.duration}>
              {playbackTime && formatDuration(Math.ceil(playbackTime))}
            </Text>
          </View>
        </ImageBackground>
        <PressableOpacity
          onPress={() => {
            navigateToPracticeScreen(id);
          }}
          style={styles.textContainer}>
          <Title style={styles.title}>{phraseTitle || musicTitle}</Title>
          <Text style={styles.mainText}>{phraseSubheading || musicArtist}</Text>
          {bookTitle && <Text style={styles.mainText}>{bookTitle}</Text>}
          <Text style={styles.subText}>{playerName}</Text>
          <View style={styles.subTextContainer}>
            <Text style={styles.subText}>{view} views</Text>
            <Text style={styles.subText}>{createdAt}</Text>
          </View>
        </PressableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );

  const renderItem: ListRenderItem<Item> = ({item}) => {
    const date = Date.parse(item.createdAt);
    const createdAt = getElapsedTime(date);
    const views = convertUnit(item.view as number) || '0';
    return (
      <Item
        id={item.id}
        key={item.id}
        thumbnailUrl={item.thumbnailUrl}
        view={views}
        createdAt={createdAt}
        bookTitle={item.bookTitle}
        phraseTitle={item.phraseTitle}
        phraseSubheading={item.phraseSubheading}
        musicTitle={item.musicTitle}
        musicArtist={item.musicArtist}
        playbackTime={item.playbackTime}
        playerName={item.playerName}
      />
    );
  };

  const LoadingIndicator = () => (
    <View style={styles.loadingIndicator}>
      <ActivityIndicator size="large" color={'white'} />
    </View>
  );

  const SearchBar = () => (
    <TouchableWithoutFeedback onPress={navigateToSearchScreen}>
      <View style={styles.searchBar}>
        <IconButton icon="magnify" />
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Portal>
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
        <Modal
          visible={isLoading}
          contentContainerStyle={styles.modalContainer}>
          <ActivityIndicator animating={true} size="large" />
        </Modal>
      </Portal>
      {results.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Button onPress={componentDidMount}>연습 기록 불러오기</Button>
        </View>
      ) : (
        <View>
          <FlatList
            style={{width: '100%'}}
            ref={flatListRef}
            viewabilityConfig={viewConfigRef.current}
            data={results}
            extraData={results}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.1}
            ListHeaderComponent={<SearchBar />}
            ListFooterComponent={isLoading ? <LoadingIndicator /> : null}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'never'}
            onRefresh={componentDidMount}
            refreshing={isRefreshing}
          />
          <FAB
            icon="chevron-up"
            small
            style={styles.fab}
            onPress={scrollToTop}
            visible={true}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  indicatorContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  itemContainer: {
    flexDirection: 'row',
    width: Dimensions.get('window').width / 1.1,
    alignSelf: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  duration: {
    backgroundColor: '#000000bb',
    padding: 5,
    color: 'white',
  },
  thumbnailContainer: {
    height: 200,
    width: 120,
  },
  thumbnail: {borderRadius: 50},
  durationTextPosition: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  loadMoreBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 40,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  textContainer: {
    marginTop: 10,
    flex: 1,
  },
  subTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainText: {
    fontSize: 15,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  subText: {
    fontSize: 15,
    paddingHorizontal: 10,
    marginBottom: 5,
    color: '#666666',
  },
  loadingIndicator: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  searchBar: {
    height: 40,
    width: Dimensions.get('window').width / 1.5,
    borderRadius: 50,
    borderWidth: 0.2,
    alignSelf: 'center',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    opacity: 0.7,
    backgroundColor: theme.colors.primary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
