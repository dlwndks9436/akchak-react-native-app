import {StyleSheet, View, Dimensions} from 'react-native';
import React, {useState} from 'react';
import {TextInput, Button} from 'react-native-paper';

export default function CreateNewPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View style={styles.container}>
      <TextInput
        label="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        style={styles.textInput}
      />
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={text => setConfirmPassword(text)}
        style={styles.textInput}
      />
      <Button
        mode="contained"
        contentStyle={styles.continueButtonContent}
        style={styles.continueButton}>
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
  continueButton: {
    marginVertical: 20,
  },
  continueButtonContent: {
    width: Dimensions.get('window').width / 1.2,
    height: 60,
  },
});
