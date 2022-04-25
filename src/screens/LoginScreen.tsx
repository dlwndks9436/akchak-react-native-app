import {StyleSheet, View, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  TextInput,
  Button,
  Text,
  Portal,
  Dialog,
  Paragraph,
  ActivityIndicator,
  Title,
} from 'react-native-paper';
import {AuthStackLoginScreenProps} from '../types/type';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {
  checkLoginError,
  dropLoginError,
  login,
} from '../features/user/userSlice';

export default function LoginScreen({navigation}: AuthStackLoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const dispatch = useAppDispatch();
  const loginError = useAppSelector(checkLoginError);

  const loginUser = () => {
    setIsLoggingIn(true);
    dispatch(login({email, password}));
  };

  const hideDialog = () => {
    setVisible(false);
    dispatch(dropLoginError());
  };

  useEffect(() => {
    if (loginError) {
      setVisible(true);
      setIsLoggingIn(false);
    }
  }, [loginError]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Content>
                <Paragraph style={{fontSize: 20}}>{loginError}</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog}>확인</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          {isLoggingIn ? (
            <View style={styles.container}>
              <Title>로그인 중..</Title>
              <ActivityIndicator animating={true} size={'large'} />
            </View>
          ) : (
            <View style={styles.container}>
              <TextInput
                label="이메일"
                value={email}
                onChangeText={text => setEmail(text)}
                autoCapitalize={'none'}
                keyboardType={'email-address'}
                style={styles.textInput}
              />
              <TextInput
                label="비밀번호"
                value={password}
                onChangeText={text => setPassword(text)}
                autoCapitalize={'none'}
                secureTextEntry={true}
                style={styles.textInput}
              />
              <Button
                style={styles.askPasswordButton}
                uppercase={false}
                compact={true}
                onPress={() => navigation.navigate('새 비밀번호')}>
                비밀번호를 잊으셨나요?
              </Button>
              <Button
                mode="contained"
                contentStyle={styles.loginButtonContent}
                style={styles.loginButton}
                onPress={loginUser}>
                로그인
              </Button>
              <View style={styles.footer}>
                <Text>아직 계정이 없으신가요?</Text>
                <Button
                  uppercase={false}
                  compact={true}
                  onPress={() => {
                    navigation.navigate('회원가입');
                  }}>
                  회원가입하기
                </Button>
              </View>
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
    paddingTop: Dimensions.get('window').height / 20,
  },
  textInput: {
    height: 50,
    width: Dimensions.get('window').width / 1.5,
    backgroundColor: '#ffffff00',
    marginBottom: 30,
  },
  askPasswordButton: {
    alignSelf: 'flex-end',
  },
  loginButton: {
    marginVertical: 20,
    width: Dimensions.get('window').width / 1.5,
  },
  loginButtonContent: {
    height: 60,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
