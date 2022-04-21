import {Dimensions, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Button, RadioButton, Title} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function CreatePracticeScreen() {
  type ObjectiveType = '음악' | '교본' | '이외';
  const [type, setType] = useState<ObjectiveType>('음악');

  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.title}>무엇을 연습하실건가요?</Title>
      <RadioButton.Group
        onValueChange={value => setType(value as ObjectiveType)}
        value={type}>
        <RadioButton.Item
          label="음악"
          value="음악"
          position="leading"
          style={styles.radioButtonContainer}
          labelStyle={styles.radioText}
        />
        <RadioButton.Item
          label="교본"
          value="교본"
          position="leading"
          style={styles.radioButtonContainer}
          labelStyle={styles.radioText}
        />
        <RadioButton.Item
          label="이외"
          value="이외"
          position="leading"
          style={styles.radioButtonContainer}
          labelStyle={styles.radioText}
        />
      </RadioButton.Group>
      <Button
        style={styles.nextButton}
        labelStyle={styles.buttonText}
        onPress={() => {}}>
        다음
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  checkTypeContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  title: {paddingTop: 30, marginBottom: 50},
  radioButtonContainer: {
    alignItems: 'center',
    width: Dimensions.get('window').width / 1.2,
    height: 50,
    borderWidth: 0.2,
    borderColor: '#e0e0e0',
    paddingHorizontal: 10,
  },
  radioText: {
    textAlign: 'left',
    paddingHorizontal: 10,
  },
  nextButton: {
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get('window').width,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '900',
    height: 70,
    textAlignVertical: 'center',
  },
});
