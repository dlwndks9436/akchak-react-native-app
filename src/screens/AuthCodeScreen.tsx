import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  Dialog,
  Paragraph,
  Portal,
  Subheading,
  TextInput,
} from 'react-native-paper';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {
  activateUser,
  checkActivateError,
  dropActivateError,
  logout,
  selectAccessToken,
} from '../features/user/userSlice';
import Api from '../libs/api';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {formatDuration} from '../utils';

export default function AuthCodeScreen() {
  const [code, setCode] = useState('');
  const [timeRemain, setTimeRemain] = useState<number>(0);
  const accessToken = useAppSelector(selectAccessToken);
  const [visible, setVisible] = useState(false);

  const dispatch = useAppDispatch();
  const activateError = useAppSelector(checkActivateError);

  const intervalId = useRef<NodeJS.Timer>();

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
    if (activateError) {
      setVisible(true);
    }
  }, [setVisible, activateError, dispatch]);

  const sendCodeToEmail = async () => {
    const result = await Api.get('auth/code', {
      headers: {Authorization: 'Bearer ' + accessToken},
    });
    if (result.status === 200) {
      setTimeRemain(1 * 60 * 5);
    } else {
      console.log(result);
    }
  };

  const verifyCode = () => {
    if (code) {
      dispatch(activateUser(code));
    } else {
      setVisible(true);
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const hideDialog = () => {
    setVisible(false);
    dispatch(dropActivateError());
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Content>
                <Paragraph style={{fontSize: 20}}>
                  Given code is not valid
                </Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog}>OK</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <Subheading style={styles.subheading}>
            Confirm code from your email to authorize this account.
          </Subheading>
          <Button
            mode="outlined"
            onPress={sendCodeToEmail}
            style={styles.button}
            contentStyle={styles.buttonContent}>
            Send code
          </Button>
          <Subheading style={styles.timerText}>
            {timeRemain > 0 && formatDuration(timeRemain)}
          </Subheading>
          <View style={styles.codeContainer}>
            <TextInput
              label="Code"
              value={code}
              onChangeText={text => setCode(text)}
              autoCapitalize={'none'}
              style={styles.textInput}
            />
            <Button
              mode="contained"
              onPress={verifyCode}
              style={styles.confirmButton}
              contentStyle={styles.confirmButtonContent}>
              Confirm
            </Button>
          </View>
          <Button
            mode="outlined"
            onPress={logoutUser}
            style={[styles.button, {marginTop: 100}]}
            contentStyle={styles.buttonContent}>
            Log out
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  timerText: {
    fontSize: 30,
    height: 30,
    textAlignVertical: 'center',
  },
  textInput: {
    height: 50,
    width: Dimensions.get('window').width / 3,
    backgroundColor: '#ffffff00',
    marginRight: 10,
  },
  button: {
    marginVertical: 20,
    width: Dimensions.get('window').width / 1.5,
  },
  buttonContent: {
    height: 60,
  },
  confirmButton: {
    marginLeft: 10,
  },
  confirmButtonContent: {height: 50},
  subheading: {
    marginHorizontal: 50,
    textAlign: 'center',
  },
});
