import {StyleSheet, View, Dimensions} from 'react-native';
import React, {useState} from 'react';
import {TextInput, Button, Text} from 'react-native-paper';
import {AuthStackLoginScreenProps} from '../types/type';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import axios, {AxiosResponse} from 'axios';
// import SecureStore from 'expo-secure-store';
// import {useAppSelector, useAppDispatch} from '../redux/hooks';

export default function LoginScreen({navigation}: AuthStackLoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [hasToken, setHasToken] = useState(false);

  // const accessToken = useAppSelector(state => state.authTokens.accessToken);
  // const refreshToken = useAppSelector(state => state.authTokens.refreshToken);
  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   const getToken = async () => {
  //     const savedAccessToken = await SecureStore.getItemAsync('accessToken');
  //     const savedRefreshToken = await SecureStore.getItemAsync('refreshToken');
  //     if (savedAccessToken && savedRefreshToken) {
  //       setHasToken(true);
  //     }
  //   };
  //   getToken();
  // }, []);

  // const login = async () => {
  //   await axios
  //     .post('http://192.168.35.202:30000/auth/signup', {
  //       email,
  //       password,
  //     })
  //     .then(async (response: AxiosResponse) => {
  //       if (response.status === 200) {
  //         const accessToken = response.data.accessToken;
  //         const refreshToken = response.data.refreshToken;
  //         await SecureStore.setItemAsync('accessToken', accessToken);
  //         await SecureStore.setItemAsync('refreshToken', refreshToken);
  //         setHasToken(true);
  //       }
  //     });
  // };

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAwareScrollView>
        <View style={styles.container}>
          <TextInput
            label="E-mail"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.textInput}
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.textInput}
          />
          <Button
            style={styles.askPasswordButton}
            uppercase={false}
            onPress={() => navigation.navigate('ForgotPassword')}>
            Forgot password?
          </Button>
          <Button
            mode="contained"
            contentStyle={styles.loginButtonContent}
            style={styles.loginButton}>
            Login
          </Button>
          <View style={styles.footer}>
            <Text>Don't have an account?</Text>
            <Button
              uppercase={false}
              onPress={() => {
                navigation.navigate('Register');
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
    paddingTop: 100,
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
