import {StyleSheet, View, Dimensions} from 'react-native';
import React, {useState} from 'react';
import {
  TextInput,
  Button,
  Portal,
  Dialog,
  Title,
  ActivityIndicator,
  Paragraph,
} from 'react-native-paper';
import {AuthStackRegisterScreenProps} from '../types';
import axios, {AxiosResponse, AxiosError} from 'axios';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import validator from 'validator';
import {API_URL} from '../utils/constants';

export default function SignupScreen({
  navigation,
}: AuthStackRegisterScreenProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorText, setErrorText] = useState('');
  const showError = () => setIsError(true);
  const hideError = () => setIsError(false);

  const usernameIsValid = (): boolean => {
    const regex = /^(?=.*[a-z])[a-zA-Z0-9]{8,20}$/i;
    return regex.test(username);
  };

  const inputsAreValid = (): boolean => {
    let hasNoError = true;
    if (validator.isEmpty(username)) {
      setErrorText('닉네임을 입력해주세요');
      hasNoError = false;
    } else if (!usernameIsValid()) {
      setErrorText(
        '닉네임은 알파벳과 숫자로 이루어져있어야하며, 길이는 8~20자 이내로 만들어주세요',
      );
      hasNoError = false;
    } else if (validator.isEmpty(email)) {
      setErrorText('이메일을 입력해주세요');
      hasNoError = false;
    } else if (!validator.isEmail(email)) {
      setErrorText('유효하지 않는 이메일 형식입니다');
      hasNoError = false;
    } else if (validator.isEmpty(password)) {
      setErrorText('비밀번호를 입력해주세요');
      hasNoError = false;
    } else if (!validator.isStrongPassword(password, {minSymbols: 0})) {
      setErrorText(
        '비밀번호는 대문자 알파벳, 소문자 알파벳, 숫자로 이루어져 있어야하며, 길이는 8자 이상이어야 합니다',
      );
      hasNoError = false;
    } else if (!password || password.localeCompare(secondPassword) !== 0) {
      setErrorText('비밀번호가 일치하지 않습니다');
      hasNoError = false;
    } else {
      setErrorText('');
    }

    return hasNoError;
  };

  const signup = async () => {
    if (inputsAreValid()) {
      setIsSigningUp(true);
      await axios
        .post(API_URL + 'player/signup', {
          username,
          email,
          password,
        })
        .then((response: AxiosResponse) => {
          setIsSigningUp(false);
          if (response.status === 201) {
            setVisibleDialog(true);
          }
        })
        .catch((err: AxiosError) => {
          setIsSigningUp(false);
          if (err.response?.data?.param) {
            if (err.response.data.param === 'username') {
              setErrorText(err.response.data.msg);
            }
            if (err.response.data.param === 'email') {
              setErrorText(err.response.data.msg);
            }
            if (err.response.data.param === 'password') {
              setErrorText(err.response.data.msg);
            }
            console.log(err.response.status);
          } else {
            console.log(err);
            setErrorText('서버에 문제가 발생했습니다. 다시 시도해주세요');
          }
          showError();
        });
    } else {
      showError();
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <Portal>
            <Dialog visible={visibleDialog}>
              <Dialog.Content>
                <Title>회원가입 완료</Title>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => {
                    setVisibleDialog(false);
                    navigation.goBack();
                  }}>
                  OK
                </Button>
              </Dialog.Actions>
            </Dialog>
            <Dialog visible={isError} onDismiss={hideError}>
              <Dialog.Content>
                <Paragraph>{errorText}</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideError}>확인</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          {isSigningUp ? (
            <View style={styles.container}>
              <Title>회원가입 진행 중...</Title>
              <ActivityIndicator animating={true} size={'large'} />
            </View>
          ) : (
            <View>
              <TextInput
                label="닉네임"
                value={username}
                autoCapitalize={'none'}
                onChangeText={text => {
                  setUsername(text);
                }}
                style={styles.textInput}
              />
              <TextInput
                label="이메일"
                value={email}
                autoCapitalize={'none'}
                onChangeText={text => setEmail(text)}
                keyboardType={'email-address'}
                style={styles.textInput}
              />
              <TextInput
                label="비밀번호"
                value={password}
                autoCapitalize={'none'}
                onChangeText={text => setPassword(text)}
                secureTextEntry={true}
                style={styles.textInput}
              />
              <TextInput
                label="비밀번호 재확인"
                value={secondPassword}
                autoCapitalize={'none'}
                onChangeText={text => setSecondPassword(text)}
                secureTextEntry={true}
                style={styles.textInput}
              />
              <Button
                mode="contained"
                contentStyle={styles.signupButtonContent}
                style={styles.signupButton}
                onPress={signup}>
                회원가입하기
              </Button>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    marginTop: Dimensions.get('window').height / 15,
  },
  textInput: {
    height: 60,
    width: Dimensions.get('window').width / 1.5,
    backgroundColor: '#ffffff00',
  },
  helperText: {
    width: Dimensions.get('window').width / 1.5,
  },
  signupButton: {
    marginVertical: 20,
  },
  signupButtonContent: {
    width: Dimensions.get('window').width / 1.5,
    height: 60,
  },
});
