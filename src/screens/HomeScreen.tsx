import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ListRenderItem,
  ImageBackground,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Dialog,
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
import {PressableOpacity} from 'react-native-pressable-opacity';
import NetInfo from '@react-native-community/netinfo';

export default function HomeScreen({navigation}: RootStackTabScreenProps) {
  interface PracticeLog {
    _id?: number;
    player_id?: number;
    goal_id?: number;
    memo?: string;
    time?: string;
    view?: string | number;
    created_at?: string;
    updated_at?: string;
    thumbnailUri?: string;
  }
  interface PracticeQueryResult {
    practiceLogs: PracticeLog[];
    totalPages: number;
    thumbnailURLs: string[];
  }

  const [isLoading, setIsLoading] = useState(false);
  const [practiceLogs, setPracticeLogs] = useState<PracticeLog[]>([]);
  const [thumbnailUrls, setThumbnailUrls] = useState<string[]>([]);
  const [isRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const accessToken = useAppSelector(selectAccessToken);
  const [search] = useState('');
  const [searchType] = useState<'title' | 'username'>();
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');

  const componentDidMount = useCallback(async () => {
    setIsLoading(true);
    try {
      NetInfo.fetch().then(async state => {
        if (state.isConnected) {
          const params: {
            page: number;
            size: number;
            title?: string;
            username?: string;
          } = {page: 1, size: 10};
          if (search) {
            if (searchType === 'title') {
              params.title = search;
            } else if (searchType === 'username') {
              params.username = search;
            }
          }
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
                console.log('loaded practices: ', data.practiceLogs);
                console.log('loaded thumbnails: ', data.thumbnailURLs);
                setPracticeLogs(data.practiceLogs);
                setThumbnailUrls(data.thumbnailURLs);
                setLastPage(data.totalPages);
              } else {
                setPracticeLogs([]);
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
  }, [accessToken, search, searchType]);

  useEffect(() => {
    componentDidMount();
  }, [componentDidMount]);

  // useEffect(() => {
  //   console.log('server data: ', practiceLogs);
  // }, [practiceLogs]);

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
          };
          const result = await Api.get('/practicelog', {
            headers: {Authorization: 'Bearer ' + accessToken},
            params,
          });
          setIsLoading(false);
          if (result.status === 200) {
            if (result.data && result.data.goals.length > 0) {
              setPracticeLogs([...practiceLogs, ...result.data.practiceLogs]);
              setThumbnailUrls([
                ...thumbnailUrls,
                ...result.data.thumbnailURLs,
              ]);
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
      setPracticeLogs([]);
      setIsLoading(false);
    }
  };

  const hideError = () => {
    setIsError(false);
  };

  const navigateToPracticeScreen = (id: number) => {
    navigation.navigate('ViewPractice', {practiceId: id});
  };

  const Item = ({
    _id,
    title,
    thumbnailUri,
    duration,
    user,
    createdAt,
    views,
  }: PracticeLog) => (
    <PressableOpacity
      style={styles.itemContainer}
      onPress={() => {
        navigateToPracticeScreen(_id!);
      }}>
      <ImageBackground
        style={styles.thumbnailContainer}
        imageStyle={styles.thumbnail}
        source={{uri: thumbnailUri}}>
        <View style={styles.durationTextPosition}>
          <Text style={styles.duration}>
            {duration && formatDuration(duration)}
          </Text>
        </View>
      </ImageBackground>
      <Title style={styles.title}>{title}</Title>
      <View style={styles.textContainer}>
        <Text style={styles.itemText}>{views} views</Text>
        <Text style={styles.itemText}>{createdAt}</Text>
      </View>
    </PressableOpacity>
  );

  const renderItem: ListRenderItem<PracticeLog> = ({item, index}) => {
    const date = Date.parse(item.created_at!);
    const createdAt = getElapsedTime(date);
    const views = convertUnit(item.view as number) || '0';
    return (
      <Item
        _id={item._id}
        key={item._id}
        thumbnailUri={thumbnailUrls[index]}
        view={item.view}
        created_at={item.created_at}
      />
    );
  };

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
      ) : practiceLogs.length === 0 ? (
        <Button onPress={componentDidMount}>연습 기록 불러오기</Button>
      ) : (
        <FlatList
          style={{width: '100%'}}
          data={practiceLogs}
          extraData={practiceLogs}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.1}
          ListFooterComponent={isLoading ? <LoadingIndicator /> : null}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={'never'}
          onRefresh={componentDidMount}
          refreshing={isRefreshing}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  indicatorContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  itemContainer: {
    padding: 20,
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
    width: '100%',
  },
  thumbnail: {borderRadius: 10},
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
    paddingHorizontal: 10,
  },
  itemText: {
    fontSize: 15,
    paddingRight: 10,
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
});
