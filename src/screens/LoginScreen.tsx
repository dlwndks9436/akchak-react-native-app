import {StyleSheet, View, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  TextInput,
  Button,
  Text,
  Portal,
  Dialog,
  Paragraph,
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

  const dispatch = useAppDispatch();
  const loginError = useAppSelector(checkLoginError);

  const loginUser = () => {
    dispatch(login({email, password}));
  };

  const hideDialog = () => {
    setVisible(false);
    dispatch(dropLoginError());
  };

  useEffect(() => {
    if (loginError) {
      setVisible(true);
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
                <Button onPress={hideDialog}>OK</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
          <TextInput
            label="E-mail"
            value={email}
            onChangeText={text => setEmail(text)}
            autoCapitalize={'none'}
            keyboardType={'email-address'}
            style={styles.textInput}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            autoCapitalize={'none'}
            secureTextEntry={true}
            style={styles.textInput}
          />
          <Button
            style={styles.askPasswordButton}
            uppercase={false}
            onPress={() => navigation.navigate('New password')}>
            Forgot password?
          </Button>
          <Button
            mode="contained"
            contentStyle={styles.loginButtonContent}
            style={styles.loginButton}
            onPress={loginUser}>
            Login
          </Button>
          <View style={styles.footer}>
            <Text>Don't have an account?</Text>
            <Button
              uppercase={false}
              onPress={() => {
                navigation.navigate('Sign up');
              }}>
              Sign up here
            </Button>
          </View>
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
    paddingTop: Dimensions.get('window').height / 10,
  },
  textInput: {
    height: 50,
    width: Dimensions.get('window').width / 1.5,
    backgroundColor: '#ffffff00',
    marginBottom: 30,
  },
  askPasswordButton: {
    alignSelf: 'flex-end',
    right: Dimensions.get('window').width / 8,
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
  },
});
