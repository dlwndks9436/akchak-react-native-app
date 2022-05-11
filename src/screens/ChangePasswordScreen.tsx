import {StyleSheet, Dimensions, View} from 'react-native';
import React, {useState} from 'react';
import {TextInput, Button, Portal, Dialog, Paragraph} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AuthStackChangePasswordScreenProps} from '../types';
import validator from 'validator';
import axios, {AxiosError} from 'axios';
import {API_URL} from '../utils/constants';

export default function ChangePasswordScreen({
  navigation,
  route,
}: AuthStackChangePasswordScreenProps): React.ReactElement {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visible, setVisible] = React.useState(false);
  const [errorText, setErrorText] = useState('');
  const [isError, setIsError] = useState(false);

  const showError = () => setIsError(true);
  const hideError = () => setIsError(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => {
    setVisible(false);
    navigation.popToTop();
  };

  const inputsAreValid = (): boolean => {
    let hasNoError = true;
    if (validator.isEmpty(password)) {
      setErrorText('비밀번호를 입력해주세요');
      hasNoError = false;
    } else if (password !== confirmPassword) {
      setErrorText('입력하신 비밀번호가 일치하지 않습니다');
      hasNoError = false;
    } else if (!validator.isStrongPassword(password, {minSymbols: 0})) {
      setErrorText(
        '비밀번호는 대문자 알파벳, 소문자 알파벳, 숫자로 이루어져 있어야하며, 길이는 8자 이상이어야 합니다',
      );
      hasNoError = false;
    } else {
      setErrorText('');
    }
    return hasNoError;
  };

  const changePassword = async () => {
    if (inputsAreValid()) {
      await axios
        .patch(API_URL + 'player/password', {
          email: route.params.email,
          code: route.params.code,
          password,
        })
        .then(result => {
          console.log('비밀번호 변경 성공: ', result.status);
          showDialog();
        })
        .catch((err: AxiosError) => {
          console.log(err);
          if (err.response?.status === 409) {
            setErrorText('비밀번호가 기존 비밀번호와 동일합니다');
            showError();
          } else {
            setErrorText('문제가 발생했습니다. 다시 시도해주세요');
            showError();
          }
        });
    } else {
      showError();
    }
  };

  return (
    <View style={{flex: 1}}>
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <Portal>
            <Dialog visible={isError} onDismiss={hideError}>
              <Dialog.Content>
                <Paragraph>{errorText}</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideError}>확인</Button>
              </Dialog.Actions>
            </Dialog>
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Content>
                <Paragraph>성공적으로 비밀번호가 변경되었습니다</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog}>확인</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <TextInput
            label="비밀번호"
            value={password}
            autoCapitalize={'none'}
            secureTextEntry={true}
            onChangeText={text => setPassword(text)}
            style={styles.textInput}
          />
          <TextInput
            label="비밀번호 재확인"
            value={confirmPassword}
            autoCapitalize={'none'}
            secureTextEntry={true}
            onChangeText={text => setConfirmPassword(text)}
            style={styles.textInput}
          />
          <Button
            mode="contained"
            contentStyle={styles.continueButtonContent}
            style={styles.continueButton}
            onPress={changePassword}>
            확인
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Dimensions.get('window').height / 7,
  },
  textInput: {
    height: 60,
    width: Dimensions.get('window').width / 1.2,
    marginVertical: 10,
  },
  helperText: {
    width: Dimensions.get('window').width / 1.5,
  },
  continueButton: {
    marginVertical: 100,
  },
  continueButtonContent: {
    width: Dimensions.get('window').width / 1.2,
    height: 60,
  },
});
