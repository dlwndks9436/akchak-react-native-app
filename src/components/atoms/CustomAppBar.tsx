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
      {back ? (
        <Appbar.Action
          icon="close"
          onPress={navigation.popToTop}
          disabled={navigation.getState().routes.length < 3}
          color={
            navigation.getState().routes.length < 3 ? 'transparent' : undefined
          }
        />
      ) : null}
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
