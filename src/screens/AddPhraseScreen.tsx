import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, Dialog, Paragraph, Portal, TextInput} from 'react-native-paper';
import validator from 'validator';
import Api from '../libs/api';
import {useAppSelector} from '../redux/hooks';
import {selectAccessToken} from '../features/user/userSlice';
import {AxiosError} from 'axios';
import {RootStackAddPhraseScreenProps} from '../types';

export default function AddPhraseScreen({
  navigation,
  route,
}: RootStackAddPhraseScreenProps): React.ReactElement {
  const [title, setTitle] = useState('');
  const [subheading, setSubheading] = useState('');
  const [page, setPage] = useState('');
  const [errorText, setErrorText] = useState('');
  const [visible, setVisible] = useState(false);
  const [phraseAdded, setPhraseAdded] = useState(false);

  const accessToken = useAppSelector(selectAccessToken);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const onPhraseAdded = () => {
    setPhraseAdded(false);
    navigation.goBack();
  };

  const addPhrase = async () => {
    if (validator.isEmpty(validator.trim(title))) {
      setErrorText('프레이즈 제목을 입력해주세요');
      showDialog();
    } else if (validator.isEmpty(page)) {
      setErrorText('프레이즈가 있는 교본의 페이지를 입력해주세요');
      showDialog();
    } else if (!validator.isNumeric(page)) {
      setErrorText('페이지에 숫자만 입력해주세요');
      showDialog();
    } else {
      await Api.post(
        'phrase',
        {
          title: validator.trim(title),
          subheading: validator.trim(subheading),
          bookId: route.params.book.id,
          page,
        },
        {headers: {Authorization: 'Bearer ' + accessToken}},
      )
        .then(() => {
          setPhraseAdded(true);
        })
        .catch((err: AxiosError) => {
          if (err.response?.status === 400) {
            console.log('에러: ', err);
          } else if (err.response?.status === 409) {
            setErrorText('이미 존재하는 프레이즈입니다');
            showDialog();
          }
        });
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Content>
              <Paragraph>{errorText}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>확인</Button>
            </Dialog.Actions>
          </Dialog>
          <Dialog visible={phraseAdded} onDismiss={onPhraseAdded}>
            <Dialog.Content>
              <Paragraph>프레이즈가 추가되었습니다</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={onPhraseAdded}>확인</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <TextInput
          label="프레이즈 제목"
          value={title}
          onChangeText={text => setTitle(text)}
          style={styles.textInput}
        />
        <TextInput
          label="프레이즈 부제목"
          value={subheading}
          onChangeText={text => setSubheading(text)}
          style={styles.textInput}
        />
        <TextInput
          label="프레이즈 페이지"
          value={page}
          onChangeText={text => setPage(text)}
          style={styles.textInput}
        />
        <Button
          style={styles.nextButton}
          labelStyle={styles.buttonText}
          onPress={addPhrase}>
          추가하기
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Dimensions.get('window').height / 7,
  },
  textInput: {
    borderRadius: 10,
    width: Dimensions.get('window').width / 1.2,
    marginBottom: 50,
    backgroundColor: '#dfdfdf',
    borderWidth: 0,
  },
  nextButton: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    marginTop: Dimensions.get('window').height / 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '900',
    height: 70,
    textAlignVertical: 'center',
  },
});
