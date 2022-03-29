import {View} from 'react-native';
import React, {useState} from 'react';
import {Searchbar} from 'react-native-paper';

export default function SearchPracticeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = (query: string) => setSearchQuery(query);

  // const goBack = () => {};
  return (
    <View>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
        autoFocus={true}
        icon="arrow-left"
        // onIconPress={}
      />
    </View>
  );
}

// const styles = StyleSheet.create({});
