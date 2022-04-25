import {StyleSheet, View, Dimensions} from 'react-native';
import React, {useState} from 'react';
import {TextInput, Button, Portal, Dialog, Paragraph} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import validator from 'validator';
import {theme} from '../styles/theme';
import {AuthStackForgotPasswordScreenProps} from '../types/type';

export default function ForgotPasswordScreen({
  navigation,
}: AuthStackForgotPasswordScreenProps): React.ReactElement {
  const [email, setEmail] = useState('');
  const [errorText, setErrorText] = useState('');
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const checkInput = async () => {
    if (validator.isEmpty(email)) {
      setErrorText('이메일을 기입해주세요');
      showDialog();
    } else if (!validator.isEmail(email)) {
      setErrorText('올바른 이메일 형식이 아닙니다');
      showDialog();
    } else {
      navigation.navigate('이메일 인증', {email});
    }
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
          </Portal>
          <Paragraph style={styles.text}>
            회원가입 하실 때 사용하셨던 이메일을 입력해주세요
          </Paragraph>
          <TextInput
            label="이메일"
            value={email}
            onChangeText={text => setEmail(text)}
            keyboardType={'email-address'}
            autoCapitalize={'none'}
            style={styles.textInput}
          />
          <Button
            mode="contained"
            contentStyle={styles.continueButtonContent}
            style={styles.continueButton}
            onPress={checkInput}>
            코드 전송하기
          </Button>
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
    marginTop: Dimensions.get('window').height / 20,
  },
  textInput: {
    height: 50,
    width: Dimensions.get('window').width / 1.5,
    backgroundColor: '#ffffff00',
    marginBottom: 30,
  },
  askPassword: {
    alignSelf: 'flex-end',
    right: Dimensions.get('window').width / 20,
  },
  continueButton: {
    marginVertical: 20,
    width: Dimensions.get('window').width / 1.5,
  },
  continueButtonContent: {
    height: 60,
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    opacity: 0.7,
  },
  text: {
    width: Dimensions.get('window').width / 2,
    textAlign: 'center',
    color: '#999999',
    marginBottom: 30,
  },
});
