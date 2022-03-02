import {StyleSheet, View, Dimensions} from 'react-native';
import React, {useState} from 'react';
import {TextInput, Button} from 'react-native-paper';

export default function CreateNewPasswordScreen() {
  const [email, setEmail] = useState('');
  const [secondEmail, setSecondEmail] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        label="Password"
        value={email}
        onChangeText={text => setEmail(text)}
        style={styles.textInput}
      />
      <TextInput
        label="Confirm Password"
        value={secondEmail}
        onChangeText={text => setSecondEmail(text)}
        style={styles.textInput}
      />
      <Button
        mode="contained"
        contentStyle={styles.loginButtonContent}
        style={styles.loginButton}>
        Create
      </Button>
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
