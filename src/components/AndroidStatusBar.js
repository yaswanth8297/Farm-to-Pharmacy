import React from 'react';
import { StatusBar } from 'react-native';
import { COLORS } from '../constants/theme';

export default function AndroidStatusBar({ dark = false, backgroundColor = COLORS.primary }) {
  return (
    <StatusBar
      barStyle={dark ? 'dark-content' : 'light-content'}
      backgroundColor={backgroundColor}
      translucent={false}
    />
  );
}
