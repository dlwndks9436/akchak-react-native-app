import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {gray} from '../styles/colors';

const TextButton: React.FC<{
  colorDepth: number;
  text: string;
  onPressFunc?: Function;
}> = ({colorDepth, text, onPressFunc}) => {
  return (
    <TouchableOpacity
      style={[styles.button, {backgroundColor: gray[colorDepth]}]}
      onPress={
        onPressFunc &&
        (() => {
          onPressFunc();
        })
      }>
      <Text>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});

export default TextButton;
