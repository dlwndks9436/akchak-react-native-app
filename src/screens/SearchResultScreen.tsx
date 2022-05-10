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
import {RootStackSearchResultScreenProps} from '../types';
import {PressableOpacity} from 'react-native-pressable-opacity';
import NetInfo from '@react-native-community/netinfo';
import {theme} from '../styles/theme';

export default function SearchResultScreen({
  navigation,
  route,
}: RootStackSearchResultScreenProps) {
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
    try {
      NetInfo.fetch().then(async state => {
        if (state.isConnected) {
          const params = {
            page: 1,
            size: 10,
            type: route.params.type,
            query: route.params.query,
          };
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
  }, [accessToken, route]);

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
            size: 10,
            type: route.params.type,
            query: route.params.query,
          };
          const result = await Api.get('/practicelog', {
            headers: {Authorization: 'Bearer ' + accessToken},
            params,
          });
          setIsLoading(false);
          if (result.status === 200) {
            if (result.data && result.data.goals.length > 0) {
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
          }}>
          <Title style={styles.title}>{phraseTitle || musicTitle}</Title>
          <Text style={styles.itemText}>{phraseSubheading || musicArtist}</Text>
          <Text style={styles.itemText}>{bookTitle || ''}</Text>
          <Text style={styles.itemText}>{playerName}</Text>
          <View style={styles.textContainer}>
            <Text style={styles.itemText}>{view} views</Text>
            <Text style={styles.itemText}>{createdAt}</Text>
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

  const Header = () => (
    <View>
      <Title style={styles.header}>
        검색 결과 - {route.params.query} ({route.params.type})
      </Title>
    </View>
  );

  const LoadingIndicator = () => (
    <View style={styles.loadingIndicator}>
      <ActivityIndicator size="large" color={'white'} />
    </View>
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
      </Portal>
      {isLoading ? (
        <View style={styles.indicatorContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : results.length === 0 ? (
        <Button onPress={componentDidMount}>연습 기록 불러오기</Button>
      ) : (
        <View>
          <FlatList
            style={{width: '100%'}}
            data={results}
            extraData={results}
            ref={flatListRef}
            viewabilityConfig={viewConfigRef.current}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.1}
            ListHeaderComponent={<Header />}
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
  header: {
    padding: 20,
    fontSize: 30,
  },
  indicatorContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  itemContainer: {
    padding: 20,
    flexDirection: 'row',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 15,
    paddingHorizontal: 10,
    marginBottom: 5,
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
    marginTop: 10,
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
});
