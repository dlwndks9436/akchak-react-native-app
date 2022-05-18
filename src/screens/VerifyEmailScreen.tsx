import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  Button,
  Dialog,
  IconButton,
  Paragraph,
  Portal,
  Subheading,
  TextInput,
} from 'react-native-paper';
import {formatDuration} from '../utils';
import axios, {AxiosError} from 'axios';
import {API_URL} from '../utils/constants';
import validator from 'validator';
import {AuthStackVerifyEmailScreenProps} from '../types';
import {authorizeUser, checkEmail, logout} from '../features/user/userSlice';

export default function VerifyEmailScreen({
  navigation,
  route,
}: AuthStackVerifyEmailScreenProps): React.ReactElement {
  const [code, setCode] = useState('');
  const [timeRemain, setTimeRemain] = useState<number>(0);
  const [errorText, setErrorText] = useState('');
  const [visible, setVisible] = useState(false);
  const [codeIssued, setCodeIssued] = useState(false);

  const dispatch = useAppDispatch();

  const intervalId = useRef<NodeJS.Timer>();
  const loginEmail = useAppSelector(checkEmail);

  useEffect(() => {
    intervalId.current = setInterval(() => {
      setTimeRemain(time => time! - 1);
    }, 1000);

    return () => {
      if (intervalId.current !== undefined) {
        clearInterval(intervalId.current);
      }
    };
  }, [timeRemain, intervalId]);

  useEffect(() => {
    if (errorText) {
      setVisible(true);
    }
  }, [setVisible, errorText, dispatch]);

  useEffect(() => {
    if (timeRemain === 0) {
      const email = loginEmail || route.params.email;
      (async () => {
        await axios
          .post(API_URL + 'verification-code', {
            email: email,
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            setTimeRemain(300);
            setCodeIssued(true);
          });
      })();
    }
  }, [timeRemain, loginEmail, route]);

  const issueCode = async () => {
    const email = loginEmail || route.params.email;

    await axios
      .post(API_URL + 'verification-code', {
        email,
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setTimeRemain(300);
        setCodeIssued(true);
      });
  };

  const verifyCode = async () => {
    const email = loginEmail || route.params.email;
    if (!validator.isEmpty(code)) {
      await axios
        .get(API_URL + 'verification-code', {
          params: {code, email},
        })
        .then(async () => {
          if (route?.params?.email) {
            navigation.replace('비밀번호 변경', {
              email: route.params.email,
              code,
            });
          } else {
            dispatch(authorizeUser(code));
          }
        })
        .catch((err: AxiosError) => {
          if (err.response?.status === 409 || err.response?.status === 401) {
            setErrorText('인증 코드가 일치하지 않습니다');
            setVisible(true);
          } else if (err.response?.status === 404) {
            setErrorText('시간이 만료되었습니다. 다시 시도해주세요');
            setVisible(true);
          } else {
            setErrorText('서버에 문제 발생했습니다. 다시 시도해주세요');
            setVisible(true);
          }
        });
    } else {
      setErrorText('인증 코드를 입력해주세요');
      setVisible(true);
    }
  };

  const hideDialog = () => {
    setVisible(false);
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return (
    <SafeAreaView style={{flex: 1}}>
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
            <Dialog visible={codeIssued} onDismiss={() => setCodeIssued(false)}>
              <Dialog.Content>
                <Paragraph>인증 코드가 새로 발급되었습니다</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => setCodeIssued(false)}>확인</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <Paragraph style={styles.text}>
            이메일로 인증코드가 전송되었습니다. 이메일을 확인하신 후에 받으신
            인증코드를 시간 내에 입력해주세요
          </Paragraph>
          <View style={styles.rowContainer}>
            <Subheading style={styles.timerText}>
              {'남은 시간: ' + formatDuration(timeRemain)}
            </Subheading>
            <IconButton icon="refresh" onPress={issueCode} />
          </View>
          <View style={styles.codeContainer}>
            <TextInput
              label="인증코드"
              value={code}
              onChangeText={text => setCode(text)}
              autoCapitalize={'none'}
              style={styles.textInput}
            />
            <Button
              mode="contained"
              onPress={verifyCode}
              contentStyle={styles.button}>
              확인
            </Button>
          </View>
          {navigation.getState().routes.length === 1 && (
            <Button
              mode="outlined"
              onPress={logoutUser}
              style={[styles.button, {marginTop: 100}]}
              contentStyle={styles.buttonContent}>
              로그아웃
            </Button>
          )}
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  codeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  rowContainer: {flexDirection: 'row', alignItems: 'center'},
  text: {
    width: Dimensions.get('window').width / 2,
    textAlign: 'center',
    color: '#999999',
    marginBottom: 30,
  },
  timerText: {
    fontSize: 20,
    height: 30,
    textAlignVertical: 'center',
  },
  textInput: {
    height: 50,
    width: Dimensions.get('window').width / 1.5,
    backgroundColor: '#ffffff00',
    marginBottom: 30,
  },
  button: {
    marginVertical: 20,
    width: Dimensions.get('window').width / 1.5,
  },
  subheading: {
    marginHorizontal: 50,
    textAlign: 'center',
  },
  buttonContent: {
    height: 60,
  },
});
