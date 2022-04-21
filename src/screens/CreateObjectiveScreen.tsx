import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {RadioButton, Text, Title} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function CreatePracticeScreen() {
  const [type, setType] = useState<'음악' | '교본' | '이외'>();

  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.title}>새로운 목표 만들기</Title>
      <Text style={{fontSize: 25}}>무엇을 연습하실 건가요?</Text>
      <View style={styles.checkTypeContainer}>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="음악"
            status={type === '음악' ? 'checked' : 'unchecked'}
            onPress={() => setType('음악')}
          />
          <Text style={styles.radioText}>음악</Text>
        </View>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="교본"
            status={type === '교본' ? 'checked' : 'unchecked'}
            onPress={() => setType('교본')}
          />
          <Text style={styles.radioText}>교본</Text>
        </View>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="이외"
            status={type === '이외' ? 'checked' : 'unchecked'}
            onPress={() => setType('이외')}
          />
          <Text style={styles.radioText}>이외</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  checkTypeContainer: {flexDirection: 'row', justifyContent: 'space-evenly'},
  title: {fontSize: 40, paddingTop: 30, marginBottom: 50},
  radioButtonContainer: {flexDirection: 'row', alignItems: 'center'},
  radioText: {fontSize: 20},
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1,
  },
});
