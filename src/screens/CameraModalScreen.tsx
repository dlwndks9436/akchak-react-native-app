import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import TextButton from '../components/IconButton';
import {RootStackScreenProps} from '../types/type';

export default function CameraModalScreen({navigation}: RootStackScreenProps) {
  return (
    <View style={styles.body}>
      <View style={styles.button}>
        <View style={styles.text_view}>
          <Text>Would you finish your practice?</Text>
        </View>
        <View style={styles.button_view}>
          <TextButton
            colorDepth={1}
            text="Yes"
            onPressFunc={() => {
              navigation.replace('VideoTrim');
            }}
          />
          <TextButton
            colorDepth={1}
            text="No"
            onPressFunc={() => navigation.goBack()}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_view: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  button_view: {flex: 1, flexDirection: 'row', justifyContent: 'space-around'},
});
