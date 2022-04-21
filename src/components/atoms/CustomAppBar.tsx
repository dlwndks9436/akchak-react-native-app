import React from 'react';
import {StyleSheet} from 'react-native';
import {Appbar} from 'react-native-paper';
import {CustomAppBarProps} from '../../types/type';

export default function CustomAppBar({
  navigation,
  back,
  route,
}: CustomAppBarProps) {
  return (
    <Appbar.Header style={styles.Header}>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={route.name} style={styles.title} />
      <Appbar.Action icon="close" onPress={navigation.popToTop} />
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  Header: {
    backgroundColor: '#f3f3f3',
    elevation: 0,
  },
  title: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
