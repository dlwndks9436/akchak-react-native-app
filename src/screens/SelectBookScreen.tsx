import {
  Dimensions,
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  Button,
  Dialog,
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

export default function SelectBookScreen({
  navigation,
}: RootStackSelectBookScreenProps): React.ReactElement {
  const [books, setBooks] = useState<Book[]>([]);
  const [book, setBook] = useState<Book>();
  const [title, setTitle] = useState<string>('');
  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const accessToken = useAppSelector(selectAccessToken);

  const fetchBooks = async (text: string) => {
    try {
      setTitle(text);
      const result = await Api.get('book', {
        headers: {Authorization: 'Bearer ' + accessToken},
        params: {limit: 5, title: text},
      });
      setBooks(result.data);
    } catch (err) {
      console.log(err);
      setBooks([]);
    }
  };

  const onItemTouch = (item: Book) => {
    setBook(item);
    setBooks([]);
    setTitle(item.title);
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

  const renderItem: ListRenderItem<Book> = ({item}) => (
    <TouchableRipple
      style={styles.listItemContainer}
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
      </Portal>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={{width: Dimensions.get('window').width}}
        ListHeaderComponent={
          <View style={styles.container}>
            <Title style={styles.title}>무슨 교본을 연습할까요?</Title>
            <Searchbar
              style={styles.inputContainer}
              value={title}
              onChangeText={fetchBooks}
              onFocus={() => {
                fetchBooks(title);
              }}
            />
          </View>
        }
        ListFooterComponent={
          <View style={styles.container}>
            <Button
              style={styles.smallButton}
              labelStyle={styles.smallButtonText}
              compact={true}
              onPress={navigateToAddBookScreen}>
              찾으시는 교본이 없나요?
            </Button>
          </View>
        }
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
    borderRadius: 10,
    width: Dimensions.get('window').width / 1.2,
    backgroundColor: '#dfdfdf',
    borderWidth: 0,
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
    marginTop: Dimensions.get('window').height / 5,
  },
  smallButtonText: {
    color: '#999999',
  },
  listItemContainer: {
    borderWidth: 0.2,
    width: Dimensions.get('window').width / 1.2,
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: '#999999',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
