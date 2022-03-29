import {StyleSheet, View, Dimensions} from 'react-native';
import React, {useState} from 'react';
import {TextInput, Button} from 'react-native-paper';
import {AuthStackForgotPasswordScreenProps} from '../types/type';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function ForgotPasswordScreen({
  navigation,
}: AuthStackForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');

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
          <Button
            mode="contained"
            contentStyle={styles.continueButtonContent}
            style={styles.continueButton}>
            Send
          </Button>
          <View style={styles.footer}>
            <Button uppercase={false} onPress={() => navigation.goBack()}>
              Back to login
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
    marginTop: Dimensions.get('window').height / 5,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
