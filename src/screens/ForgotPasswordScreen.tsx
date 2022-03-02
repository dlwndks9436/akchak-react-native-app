import {StyleSheet, View, Dimensions} from 'react-native';
import React, {useState} from 'react';
import {TextInput, Button} from 'react-native-paper';
import {AuthStackForgotPasswordScreenProps} from '../types/type';

export default function ForgotPasswordScreen({
  navigation,
}: AuthStackForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        label="E-mail"
        value={email}
        onChangeText={text => setEmail(text)}
        style={styles.textInput}
      />
      <Button
        mode="contained"
        contentStyle={styles.loginButtonContent}
        style={styles.loginButton}>
        Send
      </Button>
      <View style={styles.footer}>
        <Button uppercase={false} onPress={() => navigation.goBack()}>
          Back to login
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 60,
    width: Dimensions.get('window').width / 1.2,
    marginVertical: 10,
  },
  askPassword: {
    alignSelf: 'flex-end',
    right: Dimensions.get('window').width / 20,
  },
  loginButton: {
    marginVertical: 20,
  },
  loginButtonContent: {
    width: Dimensions.get('window').width / 1.2,
    height: 60,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
