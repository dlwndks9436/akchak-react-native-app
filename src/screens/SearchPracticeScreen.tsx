import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {RadioButton, Searchbar} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {QueryType, RootStackSearchPracticeScreenProps} from '../types';

export default function SearchPracticeScreen({
  navigation,
}: RootStackSearchPracticeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [type, setType] = useState<QueryType>('제목');

  const onChangeSearch = (query: string) => setSearchQuery(query);

  const goBack = () => {
    navigation.goBack();
  };

  const navigateToResultScreen = () => {
    navigation.replace('검색 결과', {type, query: searchQuery});
  };
  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        placeholder="연습 기록 찾기"
        onChangeText={onChangeSearch}
        value={searchQuery}
        autoFocus={true}
        icon="arrow-left"
        onIconPress={goBack}
        onSubmitEditing={navigateToResultScreen}
        autoCapitalize="none"
        style={styles.searchBar}
      />
      <RadioButton.Group
        onValueChange={newValue => {
          setType(newValue as QueryType);
        }}
        value={type}>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <RadioButton.Item label="제목" value="제목" position="leading" />
          <RadioButton.Item label="닉네임" value="닉네임" position="leading" />
          <RadioButton.Item label="책" value="책" position="leading" />
          <RadioButton.Item
            label="아티스트"
            value="아티스트"
            position="leading"
          />
        </View>
      </RadioButton.Group>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  searchBar: {
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
});
