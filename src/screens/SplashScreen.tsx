import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Logo from '../assets/images/akchak_logo_square.svg';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Logo
        height={Dimensions.get('window').width}
        width={Dimensions.get('window').width}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#212121',
  },
});
