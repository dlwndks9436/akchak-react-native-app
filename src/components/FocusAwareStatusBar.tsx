import * as React from 'react';
import {StatusBar} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

type StatusBarProps = {
  translucent?: boolean;
  backgroundColor?: string;
  barStyle?: 'dark-content' | 'default' | 'light-content';
};

export default function FocusAwareStatusBar(props: StatusBarProps) {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
}
