import {StyleSheet, View, Dimensions} from 'react-native';
import React, {useState} from 'react';
import {
  TextInput,
  Button,
  HelperText,
  Portal,
  Dialog,
  Title,
  ActivityIndicator,
} from 'react-native-paper';
import {AuthStackRegisterScreenProps} from '../types/type';
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
  const [usernameErrorText, setUsernameErrorText] = useState('');
  const [emailErrorText, setEmailErrorText] = useState('');
  const [passwordErrorText, setPasswordErrorText] = useState('');
  const [secondPasswordErrorText, setSecondPasswordErrorText] = useState('');
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const usernameErrorProps =
    usernameErrorText.length > 0
      ? {
          selectionColor: '#ff6663',
          underlineColor: '#ff6663',
          activeUnderlineColor: '#ff6663',
        }
      : null;

  const emailErrorProps =
    emailErrorText.length > 0
      ? {
          selectionColor: '#ff6663',
          underlineColor: '#ff6663',
          activeUnderlineColor: '#ff6663',
        }
      : null;

  const passwordErrorProps =
    passwordErrorText.length > 0
      ? {
          selectionColor: '#ff6663',
          underlineColor: '#ff6663',
          activeUnderlineColor: '#ff6663',
        }
      : null;

  const usernameIsValid = (): boolean => {
    const regex = /^(?=.*[a-z])[a-zA-Z0-9]{8,20}$/i;
    return regex.test(username);
  };

  const inputsAreValid = (): boolean => {
    let hasNoError = true;
    if (validator.isEmpty(username)) {
      setUsernameErrorText('Username is empty. Please fill it in...');
      hasNoError = false;
    } else if (!usernameIsValid()) {
      setUsernameErrorText(
        '1. Username must contain only alpabets and numbers.\n2. Length must be between 8~20 characters',
      );
      hasNoError = false;
    } else {
      setUsernameErrorText('');
    }
    if (validator.isEmpty(email)) {
      setEmailErrorText('Email is empty. Please fill it in...');
      hasNoError = false;
    } else if (!validator.isEmail(email)) {
      setEmailErrorText('Not a valid email address form');
      hasNoError = false;
    } else {
      setEmailErrorText('');
    }
    if (validator.isEmpty(password)) {
      setPasswordErrorText('Password is empty. Please fill it in...');
      hasNoError = false;
    } else if (!validator.isStrongPassword(password, {minSymbols: 0})) {
      setPasswordErrorText(
        '1. At least one uppercase, one lowercase, one number must be included.\n2. Must be longer than 7 characters',
      );
      hasNoError = false;
    } else {
      setPasswordErrorText('');
    }
    if (validator.isEmpty(secondPassword)) {
      setSecondPasswordErrorText(
        'Confirm password is empty. Please fill it in...',
      );
      hasNoError = false;
    } else if (!password || password.localeCompare(secondPassword) !== 0) {
      setSecondPasswordErrorText(
        'Password and Confirm password does not match.',
      );
      hasNoError = false;
    } else {
      setSecondPasswordErrorText('');
    }
    return hasNoError;
  };

  const signup = async () => {
    if (inputsAreValid()) {
      setIsSigningUp(true);
      await axios
        .post(API_URL + 'auth/signup', {
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
              setUsernameErrorText(err.response.data.msg);
            }
            if (err.response.data.param === 'email') {
              setEmailErrorText(err.response.data.msg);
            }
            if (err.response.data.param === 'password') {
              setPasswordErrorText(err.response.data.msg);
            }
            console.log(err.response.status);
          }
        });
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <Portal>
            <Dialog visible={visibleDialog}>
              <Dialog.Content>
                <Title>User account created.</Title>
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
          </Portal>
          {isSigningUp ? (
            <View style={styles.container}>
              <Title>Signing up...</Title>
              <ActivityIndicator animating={true} size={'large'} />
            </View>
          ) : (
            <View>
              <TextInput
                label="Username"
                value={username}
                autoCapitalize={'none'}
                onChangeText={text => {
                  setUsername(text);
                }}
                style={styles.textInput}
                {...usernameErrorProps}
              />
              <HelperText type="error" style={styles.helperText}>
                {usernameErrorText}
              </HelperText>
              <TextInput
                label="E-mail"
                value={email}
                autoCapitalize={'none'}
                onChangeText={text => setEmail(text)}
                keyboardType={'email-address'}
                style={styles.textInput}
                {...emailErrorProps}
              />
              <HelperText type="error" style={styles.helperText}>
                {emailErrorText}
              </HelperText>
              <TextInput
                label="Password"
                value={password}
                autoCapitalize={'none'}
                onChangeText={text => setPassword(text)}
                secureTextEntry={true}
                style={styles.textInput}
                {...passwordErrorProps}
              />
              <HelperText type="error" style={styles.helperText}>
                {passwordErrorText}
              </HelperText>
              <TextInput
                label="Confirm Password"
                value={secondPassword}
                autoCapitalize={'none'}
                onChangeText={text => setSecondPassword(text)}
                secureTextEntry={true}
                style={styles.textInput}
                {...passwordErrorProps}
              />
              <HelperText type="error" style={styles.helperText}>
                {secondPasswordErrorText}
              </HelperText>
              <Button
                mode="contained"
                contentStyle={styles.signupButtonContent}
                style={styles.signupButton}
                onPress={signup}>
                Sign up
              </Button>
              <View style={styles.footer}>
                <Button uppercase={false} onPress={() => navigation.goBack()}>
                  Back to login
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
    width: Dimensions.get('window').width,
    marginTop: Dimensions.get('window').height / 15,
  },
  textInput: {
    height: 50,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
