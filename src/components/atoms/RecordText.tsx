import React from 'react';
import {StyleSheet, Text} from 'react-native';

type textProps = {
  text: string;
};

export default function RecordText(props: textProps) {
  return <Text style={styles.text}>{props.text}</Text>;
}

const styles = StyleSheet.create({
  text: {fontSize: 20, fontFamily: 'DoHyeon-Regular'},
});
