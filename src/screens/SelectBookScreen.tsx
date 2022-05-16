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
  Modal,
  Paragraph,
  Portal,
  Searchbar,
  Subheading,
  Title,
  TouchableRipple,
} from 'react-native-paper';
import {Book, RootStackSelectBookScreenProps} from '../types';
import Api from '../libs/api';
import {useAppSelector} from '../redux/hooks';
import {selectAccessToken} from '../features/user/userSlice';
import NetInfo from '@react-native-community/netinfo';
import {theme} from '../styles/theme';

export default function SelectBookScreen({
  navigation,
}: RootStackSelectBookScreenProps): React.ReactElement {
  const [books, setBooks] = useState<Book[]>([]);
  const [book, setBook] = useState<Book>();
  const [title, setTitle] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [visible, setVisible] = React.useState(false);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
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
    NetInfo.fetch().then(async state => {
      if (state.isConnected) {
        const params = {
          page: 1,
          size: 20,
        };
        const result = await Api.get('book', {
          headers: {Authorization: 'Bearer ' + accessToken},
          params,
        });
        setIsLoading(false);
        if (result.status === 200) {
          if (result.data && result.data.books.length > 0) {
            setBooks(result.data.books);
            setLastPage(result.data.total_pages);
          } else {
            setBooks([]);
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
  }, [accessToken]);

  useEffect(() => {
    componentDidMount();
  }, [componentDidMount]);

  const getData = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      NetInfo.fetch().then(async state => {
        if (state.isConnected) {
          const params = {
            page: 1,
            size: 20,
            title,
          };
          const result = await Api.get('book', {
            headers: {Authorization: 'Bearer ' + accessToken},
            params,
          });
          setIsLoading(false);
          if (result.status === 200) {
            if (result.data && result.data.books.length > 0) {
              setQuery(title);
              setBooks(result.data.books);
              setLastPage(result.data.total_pages);
            } else {
              setBooks([]);
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
      console.log(err);
    }
  };

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
            title: query,
          };
          const result = await Api.get('book', {
            headers: {Authorization: 'Bearer ' + accessToken},
            params,
          });
          setIsLoading(false);
          if (result.status === 200) {
            if (result.data && result.data.books.length > 0) {
              setBooks([...books, ...result.data.books]);
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
      console.log(err);
      setBooks([]);
      setIsLoading(false);
    }
  };

  const onItemTouch = (item: Book) => {
    setBook(item);
    showDialog();
  };

  const selectBook = () => {
    if (book) {
      navigation.navigate('프레이즈 선택', {book});
      hideDialog();
    }
  };

  const navigateToAddBookScreen = () => {
    navigation.navigate('교본 추가');
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
        onPress={navigateToAddBookScreen}>
        찾으시는 교본이 없나요?
      </Button>
    </View>
  );

  const renderItem: ListRenderItem<Book> = ({item}) => (
    <TouchableRipple
      style={styles.listItemContainer}
      rippleColor={theme.colors.primary}
      onPress={() => {
        onItemTouch(item);
      }}>
      <View>
        <Subheading>{item.title}</Subheading>
        <Paragraph>{item.author}</Paragraph>
      </View>
    </TouchableRipple>
  );

  return (
    <View style={styles.container}>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Content>
            <Paragraph>{book?.title} 를 선택하시겠습니까?</Paragraph>
          </Dialog.Content>
          <View style={styles.actionContainer}>
            <Dialog.Actions>
              <Button onPress={selectBook}>네</Button>
            </Dialog.Actions>
            <Dialog.Actions>
              <Button onPress={hideDialog}>아니요</Button>
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
        <Modal visible={isLoading} contentContainerStyle={styles.modal}>
          <ActivityIndicator animating={true} size="large" />
        </Modal>
      </Portal>
      <FlatList
        ref={flatListRef}
        data={books}
        extraData={books}
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
            <Title style={styles.title}>무슨 교본을 연습할까요?</Title>
            <Searchbar
              style={styles.inputContainer}
              value={title}
              onChangeText={setTitle}
              onSubmitEditing={() => {
                getData();
              }}
            />
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
  modal: {
    flex: 1,
    backgroundColor: '#00000033',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
