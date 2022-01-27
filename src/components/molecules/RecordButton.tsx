import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import RecordText from '../atoms/RecordText';

type buttonProps = {
  onPressFunction: (arg0: GestureResponderEvent) => void;
  isRecording: boolean;
};

export default function recordButton(props: buttonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPressFunction}>
      <RecordText text={props.isRecording ? 'Stop' : 'Start'} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ffffffbb',
    position: 'absolute',
    width: '40%',
    height: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 20,
    borderRadius: 5,
  },
  text: {fontSize: 20, fontFamily: 'DoHyeon-Regular'},
});
