import {StyleSheet, Dimensions, View} from 'react-native';
import React, {useState} from 'react';
import {
  TextInput,
  Button,
  HelperText,
  Portal,
  Dialog,
  Paragraph,
} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AuthStackChangePasswordScreenProps} from '../types/type';
import validator from 'validator';
import axios, {AxiosError} from 'axios';
import {API_URL} from '../utils/constants';

export default function ChangePasswordScreen({
  navigation,
  route,
}: AuthStackChangePasswordScreenProps): React.ReactElement {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrorText, setPasswordErrorText] = useState('');
  const [confirmPasswordErrorText, setConfirmPasswordErrorText] = useState('');
  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => {
    setVisible(false);
    navigation.popToTop();
  };

  const passwordErrorProps =
    passwordErrorText.length > 0
      ? {
          selectionColor: '#ff6663',
          underlineColor: '#ff6663',
          activeUnderlineColor: '#ff6663',
        }
      : null;

  const inputsAreValid = (): boolean => {
    let hasNoError = true;
    if (validator.isEmpty(password)) {
      setPasswordErrorText('빈 칸입니다');
      hasNoError = false;
    } else if (!validator.isStrongPassword(password, {minSymbols: 0})) {
      setPasswordErrorText(
        '대문자 알파벳, 소문자 알파벳, 숫자로 이루어져 있어야하며, 길이는 8자 이상이어야 합니다',
      );
      hasNoError = false;
    } else {
      setPasswordErrorText('');
    }
    if (validator.isEmpty(confirmPassword)) {
      setConfirmPasswordErrorText('빈 칸입니다');
      hasNoError = false;
    } else if (!password || password.localeCompare(confirmPassword) !== 0) {
      setConfirmPasswordErrorText('비밀번호가 일치하지 않습니다');
      hasNoError = false;
    } else {
      setConfirmPasswordErrorText('');
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
        });
    }
  };

  return (
    <View style={{flex: 1}}>
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <Portal>
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
            {...passwordErrorProps}
          />
          <HelperText type="error" style={styles.helperText}>
            {passwordErrorText}
          </HelperText>
          <TextInput
            label="비밀번호 재확인"
            value={confirmPassword}
            autoCapitalize={'none'}
            secureTextEntry={true}
            onChangeText={text => setConfirmPassword(text)}
            style={styles.textInput}
            {...passwordErrorProps}
          />
          <HelperText type="error" style={styles.helperText}>
            {confirmPasswordErrorText}
          </HelperText>
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
