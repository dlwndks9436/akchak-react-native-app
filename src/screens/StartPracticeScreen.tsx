import {
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button} from 'react-native-paper';
import {RootStackStartPracticeScreenProps} from '../types/type';

export default function StartPracticeScreen({
  navigation,
}: RootStackStartPracticeScreenProps): React.ReactElement {
  const navigateToCreatePractice = () => {
    navigation.replace('CreatePractice');
  };
  return (
    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
      <SafeAreaView style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button
            style={styles.buttonTop}
            contentStyle={styles.buttonTop}
            labelStyle={styles.buttonText}
            onPress={navigateToCreatePractice}>
            연습 새로 시작하기
          </Button>
          <Button
            style={styles.buttonBottom}
            labelStyle={styles.buttonText}
            onPress={() => {}}>
            연습 이어서 하기
          </Button>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00000000',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'space-evenly',
  },
  buttonTop: {
    width: Dimensions.get('window').width / 1.1,
    borderRadius: 20,
    borderBottomWidth: 0.1,
  },
  buttonBottom: {
    width: Dimensions.get('window').width / 1.1,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 20,
    textAlignVertical: 'center',
    height: 50,
  },
});
