import {Dimensions, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import React from 'react';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {checkEmail, checkUsername, logout} from '../features/user/userSlice';

export default function ProfileScreen() {
  const username = useAppSelector(checkUsername);
  const email = useAppSelector(checkEmail);

  const dispatch = useAppDispatch();

  const logoutUser = () => {
    dispatch(logout());
  };

  return (
    <View style={styles.container}>
      <Text>Username : {username}</Text>
      <Text>E-mail : {email}</Text>
      <Button
        mode="contained"
        style={styles.logoutButton}
        contentStyle={styles.logoutButtonContent}
        onPress={logoutUser}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  logoutButton: {
    marginVertical: 20,
    width: Dimensions.get('window').width / 1.5,
  },
  logoutButtonContent: {
    height: 60,
  },
});
