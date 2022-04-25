import {Dimensions, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {Button, Text, Title} from 'react-native-paper';
import AutocompleteInput from 'react-native-autocomplete-input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export default function SelectBookScreen() {
  const [titles] = useState<[]>([]);
  const [title, setTitle] = useState<string>('');

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Title style={styles.title}>무슨 교본을 연습할까요?</Title>
        <AutocompleteInput
          data={titles}
          value={title}
          onChangeText={text => setTitle(text)}
          flatListProps={{
            keyExtractor: (_, idx) => idx.toString(),
            renderItem: ({item}) => <Text>{item}</Text>,
          }}
          style={styles.inputText}
          inputContainerStyle={styles.inputContainer}
          placeholder="교본 제목"
          placeholderTextColor="#999999"
        />
        <Button
          style={styles.nextButton}
          labelStyle={styles.buttonText}
          onPress={() => {}}>
          선택하기
        </Button>
        <Button style={styles.footerButton}>찾으시는 교본이 없나요?</Button>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'red',
  },
  title: {marginTop: 30, marginBottom: 50},
  inputContainer: {
    borderRadius: 10,
    width: Dimensions.get('window').width / 1.2,
    marginBottom: 30,
    backgroundColor: '#dfdfdf',
    borderWidth: 0,
  },
  inputText: {
    color: '#333333',
    paddingHorizontal: 20,
  },
  nextButton: {width: Dimensions.get('window').width, justifyContent: 'center'},
  buttonText: {
    fontSize: 20,
    fontWeight: '900',
    height: 70,
    textAlignVertical: 'center',
  },
  footerButton: {
    position: 'absolute',
    bottom: 0,
  },
});
