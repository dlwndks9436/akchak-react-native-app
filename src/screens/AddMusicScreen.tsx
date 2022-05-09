import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, Dialog, Paragraph, Portal, TextInput} from 'react-native-paper';
import validator from 'validator';
import Api from '../libs/api';
import {useAppSelector} from '../redux/hooks';
import {selectAccessToken} from '../features/user/userSlice';
import {AxiosError} from 'axios';
import {RootStackAddMusicScreenProps} from '../types';

export default function AddMusicScreen({
  navigation,
}: RootStackAddMusicScreenProps): React.ReactElement {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [errorText, setErrorText] = useState('');
  const [visible, setVisible] = useState(false);
  const [musicAdded, setMusicAdded] = useState(false);

  const accessToken = useAppSelector(selectAccessToken);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const onMusicAdded = () => {
    setMusicAdded(false);
    navigation.goBack();
  };

  const addMusic = async () => {
    if (validator.isEmpty(validator.trim(title))) {
      setErrorText('음악 제목을 입력해주세요');
      showDialog();
    } else if (validator.isEmpty(validator.trim(artist))) {
      setErrorText('아티스트 이름을 입력해주세요');
      showDialog();
    } else {
      await Api.post(
        'music',
        {title: validator.trim(title), artist: validator.trim(artist)},
        {headers: {Authorization: 'Bearer ' + accessToken}},
      )
        .then(() => {
          setMusicAdded(true);
        })
        .catch((err: AxiosError) => {
          if (err.response?.status === 400) {
            console.log('에러: ', err);
          } else if (err.response?.status === 409) {
            setErrorText('이미 존재하는 음악입니다');
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
          <Dialog visible={musicAdded} onDismiss={onMusicAdded}>
            <Dialog.Content>
              <Paragraph>음악이 추가되었습니다</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={onMusicAdded}>확인</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <TextInput
          label="음악 제목"
          value={title}
          onChangeText={text => setTitle(text)}
          style={styles.textInput}
        />
        <TextInput
          label="아티스트 이름"
          value={artist}
          onChangeText={text => setArtist(text)}
          style={styles.textInput}
        />
        <Button
          style={styles.nextButton}
          labelStyle={styles.buttonText}
          onPress={addMusic}>
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
    marginTop: Dimensions.get('window').height / 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '900',
    height: 70,
    textAlignVertical: 'center',
  },
});
