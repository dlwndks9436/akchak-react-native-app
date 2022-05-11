import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Dialog, Paragraph, Portal, TextInput} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import validator from 'validator';
import {AxiosError} from 'axios';
import Api from '../libs/api';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {
  checkAccountDeletionResult,
  checkUserId,
  deleteAccount,
  dropDeletionResult,
  dropUser,
  selectAccessToken,
} from '../features/user/userSlice';
export default function PersonalDataScreen() {
  const [previousPassword, setPreviousPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [isError, setIsError] = useState(false);
  const [haveResult, setHaveResult] = useState(false);
  const [visible, setVisible] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [checkDeletion, setCheckDeletion] = useState(false);
  const playerId = useAppSelector(checkUserId);
  const accessToken = useAppSelector(selectAccessToken);
  const accountDeletionResult = useAppSelector(checkAccountDeletionResult);
  const dispatch = useAppDispatch();

  const showError = () => setIsError(true);
  const hideError = () => setIsError(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const showResult = () => setHaveResult(true);
  const hideResult = () => {
    setHaveResult(false);
    const deleted = accountDeletionResult === '회원탈퇴가 완료되었습니다';
    if (deleted) {
      dispatch(dropUser());
    } else {
      dispatch(dropDeletionResult());
    }
  };

  const showCheckDeletionDialog = () => setCheckDeletion(true);
  const hideCheckDeletionDialog = () => setCheckDeletion(false);

  useEffect(() => {
    if (accountDeletionResult) {
      console.log(accountDeletionResult);

      showResult();
    }
  }, [accountDeletionResult]);

  const inputsAreValid = (): boolean => {
    let hasNoError = true;
    if (validator.isEmpty(previousPassword)) {
      setErrorText('기존 비밀번호를 입력해주세요');
      hasNoError = false;
    } else if (validator.isEmpty(newPassword)) {
      setErrorText('새 비밀번호를 입력해주세요');
      hasNoError = false;
    } else if (!validator.isStrongPassword(newPassword, {minSymbols: 0})) {
      setErrorText(
        '새 비밀번호가 대문자 알파벳, 소문자 알파벳, 숫자로 이루어져 있어야하며, 길이는 8자 이상이어야 합니다',
      );
      hasNoError = false;
    } else if (newPassword !== confirmNewPassword) {
      setErrorText('새 비밀번호가 일치하지 않습니다');
      hasNoError = false;
    } else if (previousPassword === newPassword) {
      setErrorText('새 비밀번호가 기존 비밀번호와 동일하면 안됩니다');
      hasNoError = false;
    } else {
      setErrorText('');
    }
    return hasNoError;
  };

  const changePassword = async () => {
    if (inputsAreValid()) {
      await Api.patch(
        `player/password/${playerId}`,
        {
          previousPassword,
          password: newPassword,
        },
        {
          headers: {Authorization: 'Bearer ' + accessToken},
        },
      )
        .then(result => {
          console.log('비밀번호 변경 성공: ', result.status);
          showDialog();
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    } else {
      showError();
    }
  };

  return (
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
              <Paragraph>비밀번호가 변경되었습니다</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideDialog}>확인</Button>
            </Dialog.Actions>
          </Dialog>
          <Dialog visible={checkDeletion} onDismiss={hideCheckDeletionDialog}>
            <Dialog.Content>
              <Paragraph>정말 회원탈퇴하시겠습니까?</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  hideCheckDeletionDialog();
                  dispatch(deleteAccount());
                }}>
                확인
              </Button>
              <Button onPress={hideCheckDeletionDialog}>취소</Button>
            </Dialog.Actions>
          </Dialog>
          <Dialog visible={haveResult} onDismiss={hideResult}>
            <Dialog.Content>
              <Paragraph>{accountDeletionResult}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={hideResult}>확인</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <TextInput
          label="기존 비밀번호"
          value={previousPassword}
          onChangeText={text => setPreviousPassword(text)}
          autoCapitalize={'none'}
          secureTextEntry={true}
          style={styles.textInput}
        />
        <TextInput
          label="새 비밀번호"
          value={newPassword}
          onChangeText={text => setNewPassword(text)}
          autoCapitalize={'none'}
          secureTextEntry={true}
          style={styles.textInput}
        />
        <TextInput
          label="새 비밀번호 확인"
          value={confirmNewPassword}
          onChangeText={text => setConfirmNewPassword(text)}
          autoCapitalize={'none'}
          secureTextEntry={true}
          style={styles.textInput}
        />
        <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          onPress={changePassword}>
          비밀번호 변경
        </Button>
        <Button
          mode="outlined"
          style={styles.button}
          contentStyle={styles.buttonContent}
          onPress={showCheckDeletionDialog}>
          회원탈퇴
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  button: {
    marginVertical: 20,
  },
  buttonContent: {
    width: Dimensions.get('window').width / 1.5,
    height: 60,
  },
  textInput: {
    height: 50,
    width: Dimensions.get('window').width / 1.5,
    marginVertical: 10,
  },
});
