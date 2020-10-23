import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
//import { StatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default CustomStatusBar = props => {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar {...props} /> : null;
};
