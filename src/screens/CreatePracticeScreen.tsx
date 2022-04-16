import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {RadioButton, Text, Title} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function CreatePracticeScreen() {
  const [type, setType] = useState<'노래' | '교본' | '이외'>();
  return (
    <SafeAreaView style={styles.container}>
      <Title style={styles.title}>연습 시작하기</Title>
      <Text style={{fontSize: 25}}>무엇을 연습하고 계신가요?</Text>
      <View style={styles.checkTypeContainer}>
        <View style={styles.radioButtonContainer}>
          <RadioButton
            value="노래"
            status={type === '노래' ? 'checked' : 'unchecked'}
            onPress={() => setType('노래')}
          />
          <Text style={styles.radioText}>노래</Text>
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
      {type === '노래' && (
        <View>
          <Text>노래 제목</Text>
        </View>
      )}
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
});
